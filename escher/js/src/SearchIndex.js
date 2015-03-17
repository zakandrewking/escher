define(["utils"], function(utils) {
    /** Define an index for searching for reaction and metabolites in the map.

     The index is stored in SearchIndex.index, an object of id/record pairs.

     */

    var SearchIndex = utils.make_class();
    SearchIndex.prototype = { init: init,
                              insert: insert,
                              remove: remove,
                              find: find };

    return SearchIndex;

    // definitions
    function init() {
        this.index = {};
    }

    function insert(id, record, overwrite, check_record) {
        /** Insert a record into the index.

         id: A unique string id.

         record: Records have the form:

         { 'name': '',
         'data': {} }

         Search is performed on substrings of the name.

         overwrite: (Default false) For faster performance, make overwrite true,
         and records will be inserted without checking for an existing record.

         check_record: (Default false) For faster performance, make check_record
         false. If true, records will be checked to make sure they have name and
         data attributes.

         Returns undefined.

         */
        if (!overwrite && (id in this.index))
            throw new Error("id is already in the index");
        if (check_record && !(('name' in record) && ('data' in record)))
            throw new Error("malformed record");
        this.index[id] = record;
    }

    function remove(record_id) {
        /** Remove the matching record.

         Returns true is a record is found, or false if no match is found.

         */
        if (record_id in this.index) {
            delete this.index[record_id];
            return true;
        } else {
            return false;
        }
    }

    function find(substring) {
        /** Find a record that matches the substring.

         Returns an array of data from matching records.

         */

        var re = RegExp(substring, "i"), // ignore case
            matches = [];
        for (var id in this.index) {
            var record = this.index[id];
            if (re.exec(record.name))
                matches.push(record.data);
        }
        return matches;
        
    }
});
