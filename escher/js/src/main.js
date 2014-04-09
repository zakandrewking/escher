define(["Builder", "Map", "Behavior", "KeyManager", "DataMenu", "UndoStack", "utils"],
       function(bu, mp, bh, km, dm, us, ut) {
           return { Builder: bu,
		    Map: mp,
		    Behavior: bh,
		    KeyManager: km,
		    DataMenu: dm,
		    UndoStack: us,
		    utils: ut };
       });

