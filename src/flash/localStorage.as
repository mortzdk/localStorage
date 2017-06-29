package {
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	import flash.net.SharedObject;
	import flash.net.SharedObjectFlushStatus;
	import flash.events.*;

	public class localStorage extends Sprite {
		private var storage:SharedObject;
		private var count:int;
		private var logFn:String;
		private var readyFn:String;
		private var dirtyKey:String;

		public function localStorage() {
			var prop:String;

			if (this.loaderInfo.parameters.logFn) {
				this.logFn = this.loaderInfo.parameters.logFn;
			}

			if (this.loaderInfo.parameters.readyFn) {
				this.readyFn = this.loaderInfo.parameters.readyFn;
			}

			if (this.loaderInfo.parameters.dirtyKey) {
				this.dirtyKey = this.loaderInfo.parameters.dirtyKey;
			}

			this.log("Initializing");

			if (!ExternalInterface.available) {
				this.log("ExternalInterface is not available");
				return;
			}

			this.log("Setting security restrictions");
			Security.allowDomain("*");
			Security.allowInsecureDomain("*");

            if ( !this.reload() ) {
                return;
            }

			this.log("Setting length of storage");
			this.count = 0;
			if (this.storage.data != null) {
				for (prop in this.storage.data) {
					if (prop !== dirtyKey) {
						this.count += 1;
					}
				}
			}
            // Garbage collect SharedObject
            this.storage = null;

			this.log("Creating callback methods");
			try {
				ExternalInterface.addCallback("length", this.length);
				ExternalInterface.addCallback("key", this.key);
				ExternalInterface.addCallback("getItem", this.getItem);
				ExternalInterface.addCallback("setItem", this.setItem);
				ExternalInterface.addCallback("removeItem", this.removeItem);
				ExternalInterface.addCallback("clear", this.clear);
			} catch (error:SecurityError) {
				this.log("A SecurityError occurred: " + error.message + "\n");
			} catch (error:Error) {
				this.log("An Error occurred: " + error.message + "\n");	
			}

			this.log("Firing ready state callback");
			ExternalInterface.call(this.readyFn, true);
		}

        private function reload():Boolean {
            var res:Boolean;

			this.log("Getting SharedObject");
			try {
				this.storage = SharedObject.getLocal("localStorage");
                res = true;
			} catch (error:Error) {
				this.log("Unable to create local SharedObject - " + error.message);	
                res = false;
			}

            return res;
        }
		
		private function log(msg:String):void {
			if (this.logFn) {
				try {
					ExternalInterface.call(this.logFn, msg);
				} catch (ignore:Error) {}
			}
		}
		
		private function flush():Boolean {
			var status:String = null,
				state:Boolean = true;

			try {
				status = this.storage.flush(0);
			} catch (error:Error) {
				this.log("Could not write SharedObject to disk - " + error.message);
			}

			if (this.storage != null) {
				switch (status) {
					case SharedObjectFlushStatus.PENDING:
						log("Requesting permission to save object");
						this.storage.addEventListener(
							NetStatusEvent.NET_STATUS, 
							this.status
						);
						state = false;
						break;
					case SharedObjectFlushStatus.FLUSHED:
						break;
				}
			}

			return state;
		}

		private function status(event:NetStatusEvent):void {
			switch (event.info.code) {	
				case "SharedObject.Flush.Success":
					log("User granted permission");
					break;
				case "SharedObject.Flush.Failed":
					log("User denied permission");
					break;
			}
			this.storage.removeEventListener(
				NetStatusEvent.NET_STATUS, 
				this.status
			);
            // Garbage collect SharedObject
            this.storage = null;
		}

		private function length():int {
			return this.count; 
		}

		private function key(index:int):String {
			var i:int = 0, key:String, prop:String, keys:Array;

            if ( this.reload() ) {
                try {
                    keys = new Array();
	
                    for (prop in this.storage.data) { 
                        keys.push(prop);
                    }

                    keys.sort();

                    index = index + int(keys.indexOf(dirtyKey) <= index);

                    return keys[index];
                } catch (error:Error) {
                    this.log("Unable to fetch key - " + error.message);
                }
            }

            // Garbage collect SharedObject
            this.storage = null;
			
			return null;
		}

		private function getItem(key:String):String {
			var prop:String;
			
            if ( this.reload() ) {
                try {
                    if (this.storage.data.hasOwnProperty(key)) {
                        return this.storage.data[key];
                    }
                } catch (error:Error) {
                    this.log("Unable to read data - " + error.message);
                }
            }

            // Garbage collect SharedObject
            this.storage = null;

			return null;
		}

		private function setItem(key:String, data:String):Boolean {
			var bool:Boolean, state:Boolean = false;

            if ( this.reload() ) {
                try {
                    bool = !this.storage.data.hasOwnProperty(key);
                    this.storage.data[key] = data;
                    state = this.flush();
                    if (state) { 
                        if (bool && key !== dirtyKey) {
                            this.count++;
                        }
                        // Garbage collect SharedObject
                        this.storage = null;
                    }
                } catch (error:Error) {
                    this.log("Unable to store data - " + error.message);
                }
            }

			return state;
		}

		private function removeItem(key:String):void {
            var state:Boolean;
            if ( this.reload() ) {
                try {
                    delete this.storage.data[key];
                    state = this.flush();
                    if (!this.storage.data.hasOwnProperty(key) && key !== dirtyKey) {
                        this.count = Math.max(0, this.count-1);
                    }
                    if (state) { 
                        // Garbage collect SharedObject
                        this.storage = null;
                    }
                } catch (error:Error) {
                    this.log("Unable to delete data - " + error.message);
                }
            }
		}    

		private function clear():void {
            var state:Boolean;
            if ( this.reload() ) {
                try {
                    this.storage.clear();
                    state = this.flush();
                    this.count = 0;
                    if (state) { 
                        // Garbage collect SharedObject
                        this.storage = null;
                    }
                } catch (error:Error) {
                    this.log("Unabled to clear data - " + error.message);
                }
            }
		}
	}
}
