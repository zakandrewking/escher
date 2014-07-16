define(["Builder", "Map", "Behavior", "KeyManager", "DataMenu", "UndoStack", "CobraModel", "utils", "SearchIndex", "Settings"],
       function(bu, mp, bh, km, dm, us, cm, ut, si, se) {
           return { Builder: bu,
		    Map: mp,
		    Behavior: bh,
		    KeyManager: km,
		    DataMenu: dm,
		    UndoStack: us,
		    CobraModel: cm,
		    utils: ut,
		    SearchIndex: si,
		    Settings: se };
       });

