require(["vis/bar", "vis/box-and-whiskers", "vis/category-legend",
         "vis/data-menu", "vis/epistasis", "vis/export-svg",
         "vis/histogram", "vis/resize", "vis/scatter",
         "vis/subplot", "vis/tooltip", "metabolic-map/main",
	 "metabolic-map/knockout", "builder/main"],
        function(bar, baw, cl, dm, ep, ev, hist, re, sc, sp, tt, mm, bu, ko) {
            window.visbio = { bar: bar,
                              box_and_whiskers: baw,
                              category_legend: cl,
                              data_menu: dm,
                              epistasis: ep,
                              export_svg: ev,
                              histogram: hist,
                              resize: re,
                              scatter: sc,
                              subplot: sp,
                              tooltip: tt,
			      metabolic_map: mm,
			      builder: bu,
			      knockout: ko };
        });

