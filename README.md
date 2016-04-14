What's most-frequent-k-characters? It's a metric that measures the similarity between words.
(See [this Wikipedia article](http://en.wikipedia.org/wiki/String_metric). [yea, Wikipedia,
I know])

The authors claim that it's a fast and accurate measure. Unfortunately,
I hadn't realized that the paper this algorithm is based on is *not* peer reviewed.
Hence, I'm questioning how useful this is.

I think it might actually be a *psuedo* metric when defined properly.

# Usage

Add most-freq-k-chars to your `package.json`.

```
 "dependencies": {

    //...

    "most-freq-k-chars": "git://github.com/frankandrobot/most-freq-k-chars.git#master"
  }
```

Then just do

```
var freq = require('most-freq-k-chars'),

    rslt = freq.mostFreq2Similarity(word1, word2), //OR
           freq.mostFreq3Similarity(word1, word2, //OR
           freq.mostFreqKSimilarity(word1, word2, K)
```

As per the authors, `#mostFreq2Similarity` (K = 2) is the fastest. `#mostFreq3Similarity` (K = 3)
is slightly slower but more accurate. K > 3 is slower and actually less accurate. (So you'll
probably want to stick to `#mostFreq2Similarity` and `#mostFrew3Similarity`).

# What does it measure?

I modified the algorithm to match the pseudo-code of the research paper:

With k = 1, `#mostFreqKSimilarity`
  - first it finds the most frequently-occurring letter in both words
  - returns the sum of frequencies if the letter occurs in *both* words; 0 otherwise
  - Ex1: `mostFreqKSimilarity("aaa", "bbb", 1) = 0`
  - Ex2: `mostFreqKSimilarity("aaBBBB", "BB", 1) = 6`

With k = 2, `#mostFreqKSimilarity`
  - first...
    - it finds the most frequently-occurring letter in the 1st word,
    - then it finds the *next* most frequently-occurring letter in the 1st word
    - it does the same for the 2nd word
  - then....
    - returns the sum of the frequencies of the letters that occur in *both* words; 0 otherwise
  - Ex1: `mostFreqKSimilarity("aaabb", "xyz", 2) = 0`
  - Ex2: `mostFreqKSimilarity("aaBBBBcc", "BBc", 2) = 9`

With k = 3, `#mostFreqKSimilarity` returns
  - first...
    - it finds the most frequently-occuring letter in the 1st word,
    - then it finds the *next* most frequently-occurring letter in the 1st word
    - then it finds the *next* most frequently-occurring letter in the 1st word (hence, the k=3)
    - it does the same for the 2nd word
  - then....
    - returns the sum of the frequencies of the letters that occur in *both* words; 0 otherwise
  - Ex1: `mostFreqKSimilarity("aaabb", "xyz", 3) = 0`
  - Ex2: `mostFreqKSimilarity("aaBBBBcc", "BBc", 3) = 9`
  - Ex2: `mostFreqKSimilarity("aaBBBBcccd", "aBBc", 3) = 6 + 4 + 3`

Checkout the tests for more examples.

# Run the tests

```
npm install //you may need to do sudo npm install

jasmin-node tests
```

# Credits

- Sadi Evren Seker, Oguz Altun, Uğur Ayan and Cihan MertRada Mihalcea and Paul Tarau,
  [A Novel String Distance Function based on Most Frequent K Characters]
  (http://www.researchgate.net/publication/259646670_A_Novel_String_Distance_Function_based_on_Most_Frequent_K_Characters)

