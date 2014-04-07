define(["Builder", "Map", "Behavior", "KeyManager", "DataMenu", "UndoStack"],
       function(bu, mp, bh, km, dm, us) {
           return { Builder: bu,
		    Map: mp,
		    Behavior: bh,
		    KeyManager: km,
		    DataMenu: dm,
		    UndoStack: us };
       });

