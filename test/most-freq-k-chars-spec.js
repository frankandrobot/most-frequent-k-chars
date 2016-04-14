var freq = require('../src/most-freq-k-chars'),
    _ = require('underscore');

describe("most-freq-k-chars-spec", function () {

    describe("maxFreqKHashing should match research paper examples", function () {

        var maxFreq2Hashing = _.partial(freq.maxFreqKHashing, _, 2);


        it("research", function() {

            var str = "research",

                rslt = maxFreq2Hashing(str);

            expect(rslt).toEqual("r2e2");

        });

        it("seeking", function() {

            var str = "seeking",

                rslt = maxFreq2Hashing(str);

            expect(rslt).toEqual("e2s1");

        });

        it("night/nacht", function() {

            var str = "night",
                str2 = "nacht",

                rslt = maxFreq2Hashing(str),
                rslt2 = maxFreq2Hashing(str2);

            expect(rslt).toEqual("n1i1");
            expect(rslt2).toEqual("n1a1");
        });

        it("another example 1", function() {

            var str = "aaaaabbbb",
                str2 = "ababababa",

                rslt = maxFreq2Hashing(str),
                rslt2 = maxFreq2Hashing(str2);

            expect(rslt).toEqual("a5b4");
            expect(rslt2).toEqual("a5b4");
        });

        it("significant/capabilities", function() {

            var str = "significant",
                str2 = "capabilities",

                rslt = maxFreq2Hashing(str),
                rslt2 = maxFreq2Hashing(str2);

            expect(rslt).toEqual("i3n2");
            expect(rslt2).toEqual("i3a2");
        });

        it("my/a", function() {

            var str = "my",
                str2 = "a",

                rslt = maxFreq2Hashing(str),
                rslt2 = maxFreq2Hashing(str2);

            expect(rslt).toEqual("m1y1");
            expect(rslt2).toEqual("a1 0");
        });

        it("another example 2", function() {

            var str = "LCLYTHIGRNIYYGSYLYSETWNTGIMLLLITMATAFMGYVLPWGQMSFWGATVITNLFSAIPYIGTNLV",

                rslt = maxFreq2Hashing(str);

            expect(rslt).toEqual("L9T8");
        });
    });


    describe("mostFreqKSimilarity", function() {

        /**
         * Note that the research paper is wrong!!!
         */
        describe("should match research paper: ", function() {

            var mostFreqKChars = freq.mostFreqKSimilarity;

            it("research/seeking", function() {

                var rslt = mostFreqKChars("research", "seeking", 2);

                expect(rslt).toEqual(4);
            });

            it("night/nacht", function() {

                var rslt = mostFreqKChars("night", "nacht", 2);

                expect(rslt).toEqual(2);
            });

            it("my/a", function() {

                var rslt = mostFreqKChars("my", "a", 2);

                expect(rslt).toEqual(0);
            });

            it("research", function() {

                var rslt = mostFreqKChars("research", "research", 2);

                expect(rslt).toEqual(8);
            });
        });

        describe("should work for simple examples: ", function() {

            var f = freq.mostFreqKSimilarity;

            it("k=1", function() {

                expect(f("aaa", "bbb", 1)).toEqual(0);
                expect(f("aaBBBB", "BB", 1)).toEqual(6);
            });

            it("k=2", function() {

                expect(f("aaabb", "xyz", 2)).toEqual(0);
                expect(f("aaBBBBcc", "BBc", 2)).toEqual(6);
            });

            it("k=3", function() {

                expect(f("aaabb", "xyz", 3)).toEqual(0);
                expect(f("aaBBBBcc", "BBc", 3)).toEqual(9);
                expect(f("aaBBBBcccd", "aBBc", 3)).toEqual(6 + 4 + 3);
            });
        });

        describe("should be a metric", function() {

            var f = function(str1,str2,k) {

                var max = 2*Math.max(str1.length, str2.length);

                return max - freq.mostFreqKSimilarity(str1,str2,k);
            };

            it("f(x,y) >= 0", function() {

                expect(f("aaabb", "xyz", 2) >= 0).toBe(true);
                expect(f("aaBBBBcc", "BBc", 2) >= 0).toBe(true);
            });

            /**
             * Not quite
             */
            it("f(x,y) = 0 <==> x=y", function() {

                expect(f("aaabb", "aaabb", 2)).toEqual(0);
                expect(f("aaabb", "ababa", 2)).toEqual(0);
            });

            /**
             * This is true because of the condition that you use letters occuring in *both* words
             */
            it("f(x,y) = f(y,x)", function() {

                expect(f("aaaaaC", "CCCa", 2)).toEqual(f("CCCa", "aaaaaC", 2));
            })

            /**
             * hmmm. this one's tough
             * roughly speaking, f counts the number of common letters
             */
            it("triangle inequality f(x,z) <= f(x,y) + f(y,z)", function() {

                var x = "alpha",
                    y = "gamma",
                    z = "beta";

                expect(f(x,z,2) <= f(x,y,2) + f(y,z,2)).toBe(true);

                x = "alpha";
                y = "alb";
                z = "beta";

                expect(f(x,z,2) <= f(x,y,2) + f(y,z,2)).toBe(true);
            })
        });
    });
});
