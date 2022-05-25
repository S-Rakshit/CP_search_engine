
var fs = require('fs');

class TfIdf {

  constructor() {this.corpus =[], this.tracker =[]}

/*
* Breaks a string into an array of words (aka document)
*/
  addDocumentFromString(str) {
    let strArray = str
    .replace(/[\r\n]/g," ")
    .trim()
    .split(" ");
    this.corpus.push(strArray);
    this.tracker.push({
      index: this.corpus.length - 1,
      document: str
    })
    return this.corpus
  }

  /*
  * Adds document from file path
  */
  addDocumentFromPath(path) {
    try {
      let data = fs.readFileSync(path, {encoding: 'utf8'});
      data = data.replace(/[\r\n]/g," ")
      data = data.trim();
      this.corpus.push(data.split(" "));
      this.tracker.push({
        index: this.corpus.length - 1,
        document: path
      })
    } catch (err) {
      throw err
    }
    return this.corpus
  }


/*
* Creates a corpus from an array of docs
*/
  createCorpusFromStringArray(docs) {
    let corpus = [];
    for(let i = 0; i < docs.length; i++) {
      this.corpus.push(
        docs[i]
        .replace(/[\r\n]/g," ")
        .trim()
        .split(" ")
      );
      this.tracker.push({
        index: this.corpus.length - 1,
        document: docs[i]
      })
    }
    return this.corpus
  }

/*
* Creates a corpus from an array of file paths
*/

  createCorpusFromPathArray(docs) {
    let corpus = []
    for(let i = 0; i < docs.length; i++) {
      try {
        let data = fs.readFileSync(docs[i], {encoding: 'utf8'});
        data = data.replace(/[\r\n]/g," ")
        data = data.trim();
        this.corpus.push(data.split(" "));
        this.tracker.push({
          index: this.corpus.length - 1,
          document: docs[i]
        })
      } catch (err) {
        throw err
      }
    }
    return this.corpus
  }

/*
* Calculates the term frequency (tf) of a given term in a document
* Term frequency is computed as:
* number of ocurrences of the term /length of document;
*/
  calculateTermFrequency(term, doc) {
    let numOccurences = 0;
    for (let i = 0; i < doc.length; i++){
      if (doc[i].toLowerCase() == term.toLowerCase()){
        numOccurences++;
      }
    }
    return (numOccurences * 1.0 / (doc.length + 1))
  }

  /*
  * Calculates the inverse document frequency (idf) of a term in a given document
  * idf = log(number of documents where the term appears / term frequency)
  */

//   calculateInverseDocumentFrequency(term) {
//     if (corpus_length == 0) return -1;
//     let numDocs = 0;
//     for (let i = 0; i< this.corpus.length; i++){
//       for (let j = 0; j < this.corpus[i].length; j++) {
//         if (this.corpus[i][j] == term.toLowerCase()){
//           numDocs++;
//           break;
//         }
//       }
//     }
//     return Math.log((this.corpus.length) / (numDocs + 1)) + 1;
//   }

  /*
  * Creates a vector of the idf of the query term in a given document
  */

  createIdfModel(query) {
    query = Array.isArray(query) ? query: query.split(" ");
    if (corpus_length == 0) return null;
    let model = [];
    for(let i = 0; i < query.length; i++){
      
      if(word_to_idf[query[i]] != null){
        model.push(word_to_idf[query[i]]);
      }
       else model.push(0);
    }
    return model;
  }

  /*
  * creates a vector of the tf-idf values for each query term
  * tf-idf = tf * idf
  */

  createVectorSpaceModel(query, doc) {
    query = Array.isArray(query) ? query: query.split(" ");
    if (corpus_length == 0) return null;
    let termFrequencyModel = [];
    let vectorSpaceModel = []
    for (let i = 0; i < query.length; i++){
      termFrequencyModel.push(this.calculateTermFrequency(query[i], doc));
    }
    let idfModel = this.createIdfModel(query);
    for (let j = 0; j < idfModel.length; j++){
      vectorSpaceModel[j] = idfModel[j] * termFrequencyModel[j];
    }
    this.vectorSpaceModel = vectorSpaceModel;
    return vectorSpaceModel
  }

  createVectorSpaceModel2(query, doc_idx) {
    query = Array.isArray(query) ? query: query.split(" ");
    if (corpus_length == 0) return null;
    //let termFrequencyModel = [];
    let vectorSpaceModel = []
    // for (let i = 0; i < query.length; i++){
    //   termFrequencyModel.push(this.calculateTermFrequency(query[i], doc));
    // }
    let idfModel = this.createIdfModel(query);
    for (let j = 0; j < idfModel.length; j++){
      //vectorSpaceModel[j] = idfModel[j] * termFrequencyModel[j];
      if(tfidf_val[ doc_idx][word_to_idx[query[j]]] != null){
        vectorSpaceModel[j] = tfidf_val[ doc_idx][word_to_idx[query[j]]]; 
      }
      else {
        vectorSpaceModel[j] = 0;
      }
    }
    this.vectorSpaceModel = vectorSpaceModel;
    return vectorSpaceModel
  }


  /*
  * calculates the cosine similarity between two vectors computed as thier dot
  * product. The higher the cosine similarity of a given document the closer of
  * a match it is to the query.
  */
  calculateSimilarityIndex(query, doc_idx){
    query = Array.isArray(query) ? query: query.split(" ");
    let query_vector = this.createVectorSpaceModel(query, query);
    let doc_vector = this.createVectorSpaceModel2(query, doc_idx);
    let similarityIndex = 0;
    for (let i = 0; i < query.length; i++){
      let toAdd = query_vector[i] * doc_vector[i];
      if (isNaN(toAdd)) {
        similarityIndex += 0;
      } else {
        similarityIndex += toAdd;
      }
    }
    let query_mag = this.calculateMagnitude(query_vector);
    let doc_mag = this.calculateMagnitude(doc_vector);
    //let doc_mag = magvec[doc_idx];
    let similarity = 1.0 * similarityIndex / (query_mag * doc_mag);
    return isNaN(similarity) ? 0 : similarity
  }


  /*
  * Ranks the documents in your corpus according to a query
  */
  rankDocumentsByQuery(query){
    query = query.split(" ");
    let ranking = [];
    for(let i = 1; i <= corpus_length; i++) {
      ranking.push({
        document: prob_title[i],
        similarityIndex: this.calculateSimilarityIndex(query, i),
        index: i,
        url: prob_url[i],
        });
    }
    ranking.sort((a, b) => {
      return b.similarityIndex - a.similarityIndex;
    })
    return ranking;
  }


/*
* Calculates the magnitude of an input vector
*/
  calculateMagnitude(vector) {
    let magnitude = 0
    for (let i = 0; i < vector.length; i++){
      if (isNaN(vector[i])) {
        magnitude += 0;
      } else {
        magnitude += vector[i] * vector[i];
      }
    }
    return Math.sqrt(magnitude);
  }

  /*
  * Find tracker of original documents
  */
  indicesOfInputs() {
    return this.tracker;
  }

}

module.exports = TfIdf