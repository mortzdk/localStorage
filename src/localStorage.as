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

		public function localStorage() {
			var prop:String;

			if (this.loaderInfo.parameters.logfn) {
				this.logFn = this.loaderInfo.parameters.logfn;
			}

			if (!ExternalInterface.available) {
				this.log("ExternalInterface is not available");
				return;
			}

			this.log("Initializing");
			
			Security.allowDomain("*");
			Security.allowInsecureDomain("*");

			try {
				this.storage = SharedObject.getLocal("localStorage");
			} catch (error:Error) {
				this.log("Unable to create local SharedObject - " + error.message);	
				return;
			}

			this.count = 0;
			if (this.storage.data != null) {
				for (prop in this.storage.data) {
					this.count += 1;
				}
			}

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
		}
		
		private function log(msg):void {
			if (logFn) {
				try {
					ExternalInterface.call(logFn, msg);
				} catch (ignore:Error) {}
			}
		}
		
		private function flush():void {
			var status:String = null;

			try {
				status = this.storage.flush(10000);
			} catch (error:Error) {
				this.log("Could not write SharedObject to disk - " + error.message);
			}

			if (storage != null) {
				switch (status) {
					case SharedObjectFlushStatus.PENDING:
						log("Requesting permission to save object");
						this.storage.addEventListener(
							NetStatusEvent.NET_STATUS, 
							this.status
						);
						break;
					case SharedObjectFlushStatus.FLUSHED:
						break;
				}
			}
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
		}

		private function length():int {
			return this.count; 
		}

		private function key(index:int):String {
			var i:int = 0, key:String, prop:String;

			try {
				for (prop in this.storage.data) { 
					if (i == index) { 
						return prop;
					}
					i++;
				}
			} catch (error:Error) {
				this.log("Unable to fetch key - " + error.message);
			}
			
			return null;
		}

		private function getItem(key:String):String {
			var prop:String;
			
			try {
				if (this.storage.data.hasOwnProperty(key)) {
					return this.storage.data[key];
				}
			} catch (error:Error) {
				this.log("Unable to read data - " + error.message);
			}

			return null;
		}

		private function setItem(key:String, data:String):void {
			try { 
				this.storage.data[key] = data;
				this.flush();
				this.count++;
			} catch (error:Error) {
				this.log("Unable to store data - " + error.message);
			}
		}

		private function removeItem(key:String):void {
			try {
				delete this.storage.data[key];
				this.flush();
				this.count = Math.max(0, this.count-1);
			} catch (error:Error) {
				this.log("Unable to delete data - " + error.message);
			}
		}    

		private function clear():void {
			try {
				this.storage.clear();
				this.flush();
			} catch (error:Error) {
				this.log("Unabled to clear data - " + error.message);
			}
			this.count = 0;
		}
	}
}
