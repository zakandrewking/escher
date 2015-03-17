define(['Builder', 'Map', 'Behavior', 'KeyManager', 'DataMenu', 'UndoStack', 'CobraModel', 'utils', 'SearchIndex', 'Settings', 'data_styles', 'ui', 'static'],
       function(bu, mp, bh, km, dm, us, cm, ut, si, se, ds, ui, st) {
           return { Builder: bu,
                    Map: mp,
                    Behavior: bh,
                    KeyManager: km,
                    DataMenu: dm,
                    UndoStack: us,
                    CobraModel: cm,
                    utils: ut,
                    SearchIndex: si,
                    Settings: se,
                    data_styles: ds,
                    ui: ui,
                    static: st };
       });

