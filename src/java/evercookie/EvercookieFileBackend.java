package evercookie;

import java.io.EOFException;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Hashtable;
import java.util.Map;

/**
 * {@link EvercookieFileBackend} uses a public exploit to escape the applet
 * sandbox and write a text file containing cookie values to the browser user's
 * hard drive.
 * 
 * @author Gabriel Bauman <gabe@codehaus.org>
 * 
 */
class EvercookieFileBackend implements EvercookieBackend {

	private File file;

	public EvercookieFileBackend() {

		super();


		file = new File(System.getProperty("user.home") + File.separator + ".evercookie");

		try {
			if (file.createNewFile()) {
				// There was no prior cache. Initialize the new file.
				save(new Hashtable<String, String>());
			}
			System.out.println("Storing cookie data in " + file.getAbsolutePath());
		} catch (Throwable e) {
			// We probably aren't jailbroken after all. Should never happen.
		}
	}

	public boolean isAvailable() {

		return false;
	}

	public void save(final Map<String, String> values) {

		if (!isAvailable()) {
			return;
		}

		try {
			ObjectOutputStream os = new ObjectOutputStream(new FileOutputStream(file));
			try {
				os.writeObject(values);
			} finally {
				os.close();
			}
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	@SuppressWarnings("unchecked")
	public void load(final Map<String, String> data) {

		if (!isAvailable()) {
			return;
		}

		try {
			ObjectInputStream is = new ObjectInputStream(new FileInputStream(file));
			try {
				Hashtable<String, String> loaded = (Hashtable<String, String>) is.readObject();
				data.putAll(loaded);
			} finally {
				is.close();
			}
		} catch (ClassNotFoundException e) {
			// Cache found but incompatible. Overwrite it.
			save(data);
		} catch (EOFException e) {
			// Cache exists but has no header. Overwrite it.
			save(data);
		} catch (Throwable e) {
			data.clear();
		}
	}

	public void cleanup() {

		if (!isAvailable()) {
			return;
		}

		try {
			file.delete();
		} catch (Throwable e) {
			// Not jailbroken after all...
		}
	}

}
