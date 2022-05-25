const fs = require('fs');

let word_to_idf = {};
let word_to_idx = {};
let tfidf_val = [];
let magvec = [];
let prob_title = [];
let prob_url = [];
    
var file_content = fs.readFileSync(`../scraping/keywords.txt`, 'utf8').toString().split('\n');
var file_content2 = fs.readFileSync(`../scraping/idf.txt`, 'utf8').toString().split('\n');
var file_content3 = fs.readFileSync(`../scraping/tfidf.txt`, 'utf8').toString().split('\n');
var file_content4 = fs.readFileSync(`../scraping/magnitude.txt`, 'utf8').toString().split('\n');
var file_content5 = fs.readFileSync(`../scraping/problem_titles.txt`, 'utf8').toString().split('\n');
var file_content6 = fs.readFileSync(`../scraping/problem_urls.txt`, 'utf8').toString().split('\n');

let corpus_length = file_content5.length;

//console.log(file_content[0]);

for(let i=0; i<file_content.length; i++){

    word_to_idf[file_content[i].replace(/(\r\n|\n|\r)/gm, "")] = parseFloat(file_content2[i]);
    word_to_idx[file_content[i].replace(/(\r\n|\n|\r)/gm, "")] = i;

}


// console.log(word_to_idf["us"])
//console.log(word_to_idx)

for(let i=0; i<=file_content2.length; i++){
    tfidf_val[i] = {};
}

for(let i=0; i<file_content3.length; i++){
    let data = file_content3[i].split(' ');
    //console.log(data)
    //tfidf_val[parseInt(data[0])] = {};
    tfidf_val[parseInt(data[0]) ][ parseInt( data[1])] = parseFloat(data[2].replace(/(\r\n|\n|\r)/gm, ""));


}
//console.log(tfidf_val[588][3454])

for(let i=1; i<=file_content4.length; i++){

    magvec[i] = parseFloat(file_content4[i-1].replace(/(\r\n|\n|\r)/gm, ""));
    prob_title[i] = file_content5[i-1].replace(/(\r\n|\n|\r)/gm, "");
    prob_url[i] = file_content6[i-1].replace(/(\r\n|\n|\r)/gm, "");
}

//console.log(prob_url)

//console.log(magvec[56])

