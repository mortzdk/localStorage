package evercookie;

import java.util.Map;

/**
 * A common interface for persistent storage backends.
 * 
 * @author Gabriel Bauman <gabe@codehaus.org>
 * 
 */
interface EvercookieBackend {

	boolean isAvailable();

	void save(Map<String, String> values);

	void load(Map<String, String> data);

	void cleanup();

}
