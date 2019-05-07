/**
 * SearchIndex. Define an index for searching for reaction and metabolites in
 * the map. The index is stored in SearchIndex.index, an object of id/record
 * pairs.
 */
export default class SearchIndex {
  constructor () {
    this.index = {}
  }

  /**
   * Insert a record into the index.
   * @param id - A unique string id.
   * @param record - Records have the form: { 'name': '', 'data': {} }
   * Search is performed on substrings of the name.
   * @param overwrite - (Default false) For faster performance, make overwrite true,
   * and records will be inserted without checking for an existing record.
   * @param check_record - (Default false) For faster performance, make
   * check_record * false. If true, records will be checked to make sure they
   * have name and * data attributes.
   */
  insert (id, record, overwrite, checkRecord) {
    if (!overwrite && (id in this.index)) {
      throw new Error('id is already in the index')
    }
    if (checkRecord && !(('name' in record) && ('data' in record))) {
      throw new Error('malformed record')
    }
    this.index[id] = record
  }

  /**
   * Remove the matching record. Returns true is a record is found, or false if
   * no match is found.
   */
  remove (recordId) {
    if (recordId in this.index) {
      delete this.index[recordId]
      return true
    } else {
      return false
    }
  }

  /**
   * Find a record that matches the substring. Returns an array of data from
   * matching records.
   */
  find (substring) {
    const re = RegExp(substring, 'i') // ignore case
    const matches = []
    for (let id in this.index) {
      const record = this.index[id]
      if (re.exec(record.name)) {
        matches.push(record.data)
      }
    }
    return matches
  }
}
