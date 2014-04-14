define(["Builder", "Map", "Behavior", "KeyManager", "DataMenu", "UndoStack", "CobraModel", "utils"],
       function(bu, mp, bh, km, dm, us, cm, ut) {
           return { Builder: bu,
		    Map: mp,
		    Behavior: bh,
		    KeyManager: km,
		    DataMenu: dm,
		    UndoStack: us,
		    CobraModel: cm,
		    utils: ut };
       });

