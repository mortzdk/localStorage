package evercookie;

import java.io.EOFException;
import java.io.FileNotFoundException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.URL;
import java.util.Hashtable;
import java.util.Map;

import javax.jnlp.BasicService;
import javax.jnlp.FileContents;
import javax.jnlp.PersistenceService;
import javax.jnlp.ServiceManager;
import javax.jnlp.UnavailableServiceException;

/**
 * {@link EvercookieJnlpBackend} uses the JNLP {@link PersistenceService} to
 * store Evercookie data. This will only work in Java 1.5 or better.
 * 
 * @author Gabriel Bauman <gabe@codehaus.org>
 * 
 */
class EvercookieJnlpBackend implements EvercookieBackend {

	private PersistenceService persistenceService = null;
	private boolean isAvailable = true;
	private URL codebaseUrl;

	public EvercookieJnlpBackend() {
		super();
		try {
			BasicService basicService = (BasicService) ServiceManager.lookup("javax.jnlp.BasicService");
			codebaseUrl = basicService.getCodeBase();
			persistenceService = (PersistenceService) ServiceManager.lookup("javax.jnlp.PersistenceService");
		} catch (UnavailableServiceException e) {
			// JNLP services not available. We're dead in the water.
			isAvailable = false;
		}
	}

	public boolean isAvailable() {
		return isAvailable;
	}

	public void save(final Map<String, String> values) {
		try {
			FileContents file = persistenceService.get(codebaseUrl);
			ObjectOutputStream os = new ObjectOutputStream(file.getOutputStream(true));
			try {
				os.writeObject(values);
				os.flush();
			} finally {
				os.close();
			}
		} catch (FileNotFoundException e) {
			initialize();
			save(values); // recursion. This could be bad if things get wonky.
		} catch (Throwable e) {
			// Cache not saved for some reason.
			e.printStackTrace();
		}
	}

	@SuppressWarnings("unchecked")
	public void load(final Map<String, String> data) {
		try {
			FileContents file = persistenceService.get(codebaseUrl);
			ObjectInputStream is = new ObjectInputStream(file.getInputStream());
			try {
				Hashtable<String, String> crap = (Hashtable<String, String>) is.readObject();
				data.putAll(crap);
			} finally {
				is.close();
			}
		} catch (FileNotFoundException e) {
			// No cache exists.
			initialize();
			save(data);
		} catch (ClassNotFoundException e) {
			// Cache found but incompatible. Overwrite it.
			save(data);
		} catch (EOFException e) {
			// Cache exists but has no header. Overwrite it.
			save(data);
		} catch (Throwable e) {
			// You will not go to space today.
			e.printStackTrace();
		}
	}

	public void cleanup() {
		try {
			persistenceService.delete(codebaseUrl);
		} catch (Throwable e) {
			// Cache didn't exist in the first place, but so what?
		}
	}

	private void initialize() {
		try {
			long size = persistenceService.create(codebaseUrl, 16000);
			System.out.println("Cache initialized at " + codebaseUrl + " with size " + size);
		} catch (Throwable e) {
			// We're screwed.
			System.err.println("Unable to initialize cache.");
		}

	}
}
