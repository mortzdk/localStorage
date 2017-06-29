import java.applet.Applet;
import java.awt.HeadlessException;
import java.io.EOFException;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InvalidClassException;
import java.io.NotSerializableException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OptionalDataException;
import java.io.StreamCorruptedException;
import java.net.URL;
import java.net.MalformedURLException;
import java.util.Hashtable;
import java.util.Enumeration;

import javax.jnlp.BasicService;
import javax.jnlp.FileContents;
import javax.jnlp.PersistenceService;
import javax.jnlp.ServiceManager;
import javax.jnlp.UnavailableServiceException;

import netscape.javascript.JSObject;
import netscape.javascript.JSException;

/**
 * This applet persists data in the user's browser using the jnlp 
 * PersistenceService.
 * 
 * @author Morten Houmøller Nygaard <morten@mortz.dk>
 */
public class LocalStorageApplet extends Applet {
	public static final long serialVersionUID = 12334812939234L;
    private static final long MEBIBYTE = 1048576;

    private Hashtable<String, String> table;
	private PersistenceService ps;
	private BasicService bs;
	private URL codebase;

    // Parameters
    private String logFn;
    private String readyFn;
    private String dirtyKey;

	public LocalStorageApplet() throws HeadlessException {
		super();
	}

	public void init() {
        BasicService bs = null;

		try {
            this.logFn    = this.getParameter("logFn");
            this.readyFn  = this.getParameter("readyFn");
            this.dirtyKey = this.getParameter("dirtyKey");

			this.ps = (PersistenceService) 
				ServiceManager.lookup("javax.jnlp.PersistenceService");
			bs = (BasicService) 
				ServiceManager.lookup("javax.jnlp.BasicService");

            // Get URL from jnlp file or of JAR
			this.codebase = bs.getCodeBase();

            // Create data table
            this.table = new Hashtable<String, String>();
		} catch (UnavailableServiceException e) {
			ps       = null;
			codebase = null;

            this.log("Unable to load Services:" + e);
            return;
        }

        if ( this.reload() ) {
            // call callback
            super.init();

            try {
                JSObject window = JSObject.getWindow(this);
                window.call(this.readyFn, new Object[]{true});
            } catch(JSException e) {
                this.log("Unable to invoke javascript:" + e);
            }
        }
    }

    private void log(String _msg) {
        System.out.println(_msg);
        if ( this.logFn != null ) {
            try {
                JSObject window = JSObject.getWindow(this);
                window.call(logFn, new Object[]{_msg});
            } catch(JSException e) {
            }
        }
    }

    public int length() {
        if ( !this.reload() ) {
            this.log("Unable to invoke reload");
            return 0;
        }

        return this.table.size() -
            (this.table.containsKey(this.dirtyKey) ? 1 : 0);
    }

    public String key(int _index) {
        String key;
        int i = 0;

        if ( !this.reload() ) {
            this.log("Unable to invoke reload");
            return null;
        }

        for (Enumeration<String> keys = this.table.keys(); keys.hasMoreElements();) {
            key = keys.nextElement();
                
            if ( key.equals(this.dirtyKey) ) {
                _index += 1;
            }

            if ( i == _index ) {
                return key;
            }

            i += 1;
        }

        return null;
    }

    public void setItem(String _key, String _value) {
        if ( !this.reload() ) {
            this.log("Unable to invoke reload");
            return;
        }

        this.table.put(_key, _value);

        if ( !this.save(false) ) {
            this.log("Unable to invoke save the item");
        }
    }

    public String getItem(String _key) {
        if ( !this.reload() ) {
            this.log("Unable to invoke reload");
            return null;
        }

        return this.table.get(_key);
    }

    public void removeItem(String _key) {
        if ( !this.reload() ) {
            this.log("Unable to invoke reload");
            return;
        }

        this.table.remove(_key);

        if ( !this.save(false) ) {
            this.log("Unable to invoke save and remove the item");
        }
    }

    public void clear() {
        if ( !this.reload() ) {
            this.log("Unable to invoke reload");
        }

        try {
            this.ps.delete(this.codebase);
        } catch (Exception e) {}
    }

	private boolean save(boolean retry) {
        ObjectOutputStream os = null;
        boolean result = true;

		try {
			FileContents file = this.ps.get(this.codebase);
			os = new ObjectOutputStream(file.getOutputStream(true));
			os.writeObject(this.table);
			os.flush();
		} catch (FileNotFoundException e) {
            if ( !retry ) {
                result = this.save(false);
            } else {
                this.log("FileNotFoundException occured:" + e);
                result = false;
            }
		} catch (InvalidClassException e) {
            this.log("InvalidClassException occured:" + e);
            result = false;
		} catch (NotSerializableException e) {
            this.log("NotSerializableException occured:" + e);
            result = false;
		} catch (SecurityException e) {
            this.log("SecurityException occured:" + e);
            result = false;
		} catch (IOException e) {
            this.log("IOException occured:" + e);
            result = false;
		} finally {
            if (os != null) {
                try {
			        os.close();
                } catch (IOException e) {}
            }
        }	
        return result;
	}

    @SuppressWarnings("unchecked")
	private boolean load() {
        ObjectInputStream is = null;
        boolean result = true;

		try {
			FileContents file = this.ps.get(this.codebase);
			is = new ObjectInputStream(file.getInputStream());
			Hashtable<String, String> t = (Hashtable<String, String>) 
                is.readObject();
			this.table.putAll(t);
		} catch (FileNotFoundException e) {
			// No cache exists.
			result = this.save(false);
		} catch (ClassNotFoundException e) {
			// Data store found but incompatible.
			result = this.save(false);
		} catch (EOFException e) {
			// Data store exists but has no header.
			result = this.save(false);
		} catch (InvalidClassException e) {
            // Corrupt data store, build new one
			result = this.save(false);
		} catch (StreamCorruptedException e) {
            this.log("StreamCorruptedException occured:" + e);
            result = false;
		} catch (OptionalDataException e) {
            this.log("OptionalDataException occured:" + e);
            result = false;
        } catch (SecurityException e) {
            this.log("SecurityException occured:" + e);
            result = false;
        } catch (NullPointerException e) {
            this.log("NullPointerException occured:" + e);
            result = false;
		} catch (IOException e) {
            this.log("IOException occured:" + e);
            result = false;
		} finally {
		    if (is != null) {
                try {
                    is.close();
                } catch (IOException e) {}
            }
	    }	
        return result;
	}

    private boolean reload() {
		try {
            this.ps.create(this.codebase, 5*MEBIBYTE); 

            // Clear current table
            this.table.clear();

            // Load data
            return this.load();
        } catch (java.net.MalformedURLException e) {
            this.log("MalformedURLException occured:" + e);
            return false;
        } catch (java.io.IOException e) {
            this.log("IOException occured:" + e);
            return false;
        }
    }

}
