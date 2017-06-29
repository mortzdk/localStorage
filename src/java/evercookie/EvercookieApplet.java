package evercookie;

import java.applet.Applet;
import java.awt.HeadlessException;
import java.util.Hashtable;
import java.util.Map;

/**
 * This applet persists Evercookies in the user's browser using as many
 * strategies as possible. You can call it from Javascript using domId.set() or
 * domId.get().
 * 
 * @author Gabriel Bauman <gabe@codehaus.org>
 * 
 */
public class EvercookieApplet extends Applet {

	private static final long serialVersionUID = 1L;
	private static final EvercookieBackend[] backends = { new EvercookieFileBackend(), new EvercookieJnlpBackend() };

	private final Hashtable<String, String> data = new Hashtable<String, String>();
	private boolean workingBackends = false;

	public EvercookieApplet() throws HeadlessException {
		super();
	}

	@Override
	public void init() {

		for (EvercookieBackend backend : backends) {
			if (backend.isAvailable()) {
				this.workingBackends = true;
				break;
			}
		}

		if (!workingBackends) {
			System.out.println("Initialization failed. No working backends.");
			return;
		}

		load(data);

		System.out.println("Initialization complete. Cache has " + this.data.size() + " entries.");

		super.init();
	}

	public String get(String name) {
		return data.get(name);
	}

	public void set(String name, String value) {
		data.put(name, value);
		save(data);
	}

	private void save(Map<String, String> values) {

		if (!workingBackends) {
			return;
		}

		for (EvercookieBackend backend : backends) {
			if (backend.isAvailable()) {
				backend.save(values);
				System.out.println(backend.getClass().getSimpleName() + ": saved: " + data.toString());
			}
		}

	}

	private void load(Map<String, String> data) {

		if (!workingBackends) {
			return;
		}

		data.clear();

		for (EvercookieBackend backend : backends) {
			if (backend.isAvailable()) {
				backend.load(data);
				System.out.println(backend.getClass().getSimpleName() + ": loaded: "
						+ data.toString());
			}
		}
	}

	public void cleanup() {

		if (!workingBackends) {
			return;
		}

		for (EvercookieBackend backend : backends) {
			if (backend.isAvailable()) {
				backend.cleanup();
				System.out.println(backend.getClass().getSimpleName() + ": cleaned up.");
			}
		}
	}

}
