var assert = require('assert');
var hink = require("../hink");

var KeyValuePair = hink.KeyValuePair;
describe('KeyValuePair', function() {
    var kvp1, kvp2,
    key1 = "KEY1", value1 = "VALUE1",
    key2 = "KEY2", value2 = "VALUE2";

    var init = function() {
        kvp1 = new hink.KeyValuePair(key1, value1);
        kvp2 = new hink.KeyValuePair({key:key2, value:value2});
    };

    beforeEach(init);

    describe('#ctor', function() {
        it('should allow key to be passed as first parameter and value as second', function() {
            assert.equal(kvp1.key, key1);
            assert.equal(kvp1.value, value1);
        });

        it('should allow key and value to be passed in an object as first parameter', function() {
            assert.equal(kvp2.key, key2);
            assert.equal(kvp2.value, value2);
        });
    });

    describe('#equal', function() {
        it('should return true if one kvp is equal by value to another (false otherwise)', function() {
            assert.equal(kvp1.equal(kvp2), false);
            assert.equal(kvp1.equal({}), false);
            assert.equal(kvp1.equal(""), false);
            assert.equal(kvp1.equal(1), false);
            assert.equal(kvp1.equal(kvp1), true);
        });
    });
});


var Dictionary = hink.Dictionary;
describe('Dictionary', function() {
    var testKvp1, testKvp2, testKvp3, dict, kvpList

    var init = function() {
        testKvp1 = new hink.KeyValuePair("testKey1", "testValue1");
        testKvp2 = new hink.KeyValuePair("testKey2", "testValue2");
        testKvp3 = new hink.KeyValuePair("testKey3", "testValue3");
        kvpList = [testKvp1, testKvp2, testKvp3];
        dict = new hink.Dictionary(testKvp1, testKvp2, testKvp3);
    }

    beforeEach(init);

    describe('#ctor', function() {
        it('should not accept object that are not instances of KeyValuePair or objects that resemble KeyValuePairs', function() {
            assert.throws(function() {
                var asd = new Dictionary("asd");
            });
            assert.throws(function() {
                var asd = new Dictionary(["asd", 1]);
            });
            assert.throws(function() {
                var asd = new Dictionary(123, "asd");
            });
            assert.equal(dict.count, kvpList.length);
        });
        it('should accept both KeyValuePairs and object with a key and value property', function() {
            var d;
            d = new hink.Dictionary({key: testKvp1.key, value: testKvp1.value});
            d = new hink.Dictionary(testKvp1);
        });
        it('should accept an array of both KeyValuePairs and objects with a key and value property', function() {
            var d;
            d = new hink.Dictionary({key: testKvp1.key, value: testKvp1.value}, {key: testKvp2.key, value: testKvp2.value});
            assert.equal(d.count, 2)
            d = new hink.Dictionary(testKvp1, testKvp2);
            assert.equal(d.count, 2)
            d = new hink.Dictionary({key: testKvp1.key, value: testKvp1.value}, testKvp2);
            assert.equal(d.count, 2)
        });
    });

    describe('#get', function() {
        it('should return the KeyValuePair which corresponds to a certain key', function() {
            assert.equal(dict.get(testKvp1.key), testKvp1.value);
        });
    });

    describe('#set', function() {
        it('should set the value of the kvp to the new value', function() {
            var nv = "NEWVAL";
            dict.set(testKvp2.key, nv);
            assert.equal(dict.get(testKvp2.key), nv);
        });

        it('should accept a kvp object', function() {
            var nv = "NEWVAL";
            testKvp2.value = nv;
            dict.set(testKvp2);
            assert.equal(dict.get(testKvp2.key), nv);
        });
    });

    describe('#put', function() {
        it('should set the value of the kvp to the new value if it exists', function() {
            var nv = "ASDASDASD";
            var tkvp1 = new hink.KeyValuePair(testKvp1.key, nv);
            dict.put(tkvp1.key, tkvp1.value);
            assert.equal(dict.get(testKvp1.key), nv);
        });

        it('Otherwise add the kvp', function() {
            var nk = "KEYASDASDASD";
            var nv = "VALUEASDASDASD";
            var tkvp1 = new hink.KeyValuePair(nk, nv);
            dict.put(tkvp1.key, tkvp1.value);
            assert.equal(dict.get(tkvp1.key), nv);
        });

        it('should accept a kvp object', function() {
            var nv = "NEWVALFORPUT";
            testKvp2.value = nv;
            dict.put(testKvp2);
            assert.equal(dict.get(testKvp2.key), nv);
        });
    });

    describe('#add', function() {
        it('should add the key value pair', function() {
            var nkvp = new hink.KeyValuePair("NEWKEY", "NEWVAL");
            dict.add(nkvp);
            assert.equal(dict.get(nkvp.key), nkvp.value);
        });
    });

    describe('#remove', function() {
        it('should remove the key value pair based on key', function() {
            dict.remove(testKvp2.key, function(r) {
                assert.equal(r.equal(testKvp2), true);
            });
            assert.equal(dict.get(testKvp2.key), undefined);
        });
    });

    describe('#count', function() {
        it('should return the length of the dictionary', function() {
            var kvp1 = new hink.KeyValuePair("NEWKEY1", "NEWVAL");
            var kvp2 = new hink.KeyValuePair("NEWKEY2", "NEWVAL");
            var ref = [kvp1, kvp2];
            var dict = new hink.Dictionary(kvp1, kvp2);
            assert.equal(dict.count, ref.length);
        });
    });

    describe('#keys', function() {
        it('should return all keys in the dictionary', function() {
            var keys = dict.keys;
            for (var i = 0, max = keys.length; i < max; i++) {
                assert.notEqual(keys.indexOf(kvpList[i].key), -1);
            }
            for (var i = 0, max = kvpList.length; i < max; i++) {
                assert.notEqual(keys.indexOf(kvpList[i].key), -1);
            }
        });
    });

    describe('#values', function() {
        it('should return all values in the dictionary', function() {
            var values = dict.values;
            for (var i = 0, max = values.length; i < max; i++) {
                assert.notEqual(values.indexOf(kvpList[i].value), -1);
            }
            for (var i = 0, max = kvpList.length; i < max; i++) {
                assert.notEqual(values.indexOf(kvpList[i].value), -1);
            }
        });
    });
});

var Tuple = hink.Tuple;
describe('Tuple', function() {
    var tupl, limit = 2, i1 = {a:123}, i2 = {b:234}, refList = [i1, i2];

    var init = function() {
        tupl = new hink.Tuple(limit, refList);
    }

    beforeEach(init);

    describe('#limit', function() {
        it('should return the limit of the tuple', function() {
            assert.equal(tupl.limit, limit);
        });
    });

    describe('#ctor', function() {
        it('should accept the limit as first arg, and objects to add to the data as the rest.', function() {
            var lim = 5;
            var t = new hink.Tuple(lim, 1, 2, 3, 4, 5);
            assert.equal(t.data.length, lim);
        });

        it('should accept the limit as first arg, and an array as second with the data', function() {
            var lim = 5;
            var data = (function() {
                var tmp = [];
                for (var i = lim; i--;) {
                    tmp.push(i);
                }
                return tmp;
            }());
            var t = new hink.Tuple(lim, data);
            assert.equal(t.data.length, data.length);
        });

        it('should throw if first arg isn\'t a number', function() {
            assert.throws(function() {
                new hink.Tuple("")
            });

            assert.throws(function() {
                new hink.Tuple();
            });
        });

        it('should throw if first arg is zero or negative', function() {
            assert.throws(function() {
                new hink.Tuple(0)
            });
            assert.throws(function() {
                new hink.Tuple(-100)
            });
        });
    });

    describe('#get', function() {
        it('should get the object at the supplied index', function() {
            var t = new hink.Tuple(limit, i1);
            assert.equal(t.get(0), i1);
        });

        it('should throw if index is out of bounds', function() {
            var t = new hink.Tuple(limit);
            assert.throws(function() {
                t.get(100);
            });
        });
    });

    describe('#add', function() {
        it('should add the supplied object to the Tuple if there\'s space left', function() {
            var t = new hink.Tuple(limit, i1);
            t.add(i2);
            assert.equal(t.get(0), i1);
            assert.equal(t.get(1), i2);
        });

        it('should throw if reached limit', function() {
            var t = new hink.Tuple(limit, i1);
            t.add(i2);
            assert.throws(function() {
                t.add({c:345});
            });
        });
    });

    describe('#put', function() {
        it('should update the object at the supplied index with the supplied value if index <= limit', function() {
            var t = new hink.Tuple(limit, i1);
            var i3 = {c:345};
            t.put(0, i3);
            t.put(1, i2);
            assert.equal(t.get(0), i3);
            t.put(0, i1);
            assert.equal(t.get(0), i1);
            assert.equal(t.get(1), i2);
        });

        it('should throw if index > limit', function() {
            var t = new hink.Tuple(limit, i1);
            t.add(i2);
            assert.throws(function() {
                t.put(2, {c:345});
            });
        });
    });
});

var Stack = hink.Stack;
describe('Stack', function() {

    var testData = [{a: 123}, [3, 2, 1], 1, 2, 3, 'a', 'b', 'c'];

    var testStack = function(data, stack) {
        for (var i = data.length; i--;) {
            var curr = stack.pop();
            assert.equal(curr, data[i]);
        }
    };

    describe('#ctor', function() {
        it('should accept an array as arg to init the data', function() {
            var s = new hink.Stack(testData);
            testStack(testData, s);
        });

        it('should accept varargs to init the data', function() {
            var t = testData;
            var u = [t[0], t[1], t[2]];
            var s = new hink.Stack(t[0], t[1], t[2]);
            testStack(u, s);
        });

        it('should also accept no arguments', function() {
            var s = new hink.Stack();
        });
    });

    describe('#peek', function() {
        it('should return the element that is first to be popped', function() {
            var s = new hink.Stack(testData);
            assert.equal(testData[testData.length - 1], s.peek);
        });
    });

    describe('#push', function() {
        it('should add the element to the end of stack', function() {
            var s = new hink.Stack();
            for(var i = 0, max = testData.length; i < max; i++) {
                s.push(testData[i]);
                assert.equal(s.peek, testData[i]);
            }
            testStack(testData, s);
        });
    });

    describe('#pop', function() {
        it('should pop the element from the end of the stack (removing it)', function() {
            var s = new hink.Stack();
            var t1 = {a:123};
            var t2 = {b:234};
            s.push(t1);
            s.push(t2);
            assert.equal(s.peek, t2);
            assert.equal(s.pop(), t2);
            assert.equal(s.peek, t1);
            assert.equal(s.pop(), t1);
        });
    });

    describe('#deplete', function() {
        it('should call the callback with each of the items in the Queue, thus depleting it', function() {
            var s = new hink.Stack(testData);
            var counter = testData.length - 1;
            assert.equal(s.data.length, testData.length);
            s.deplete(function(element) {
                assert.equal(s, this);
                assert.equal(testData[counter], element);
                counter--;
            });
            assert.equal(s.data.length, 0);
        });
    });
});

var Queue = hink.Queue;
describe('Queue', function() {

    var testData = [{a: 123}, [3, 2, 1], 1, 2, 3, 'a', 'b', 'c'];

    var testQueue = function(data, queue) {
        for (var i = 0, max = data.length; i < max; i++) {
            var curr = queue.deq();
            assert.equal(curr, data[i]);
        }
    };

    describe('#ctor', function() {
        it('should accept an array to init the data', function() {
            var q = new hink.Queue(testData);
            testQueue(testData, q);
        });

        it('should accept varargs to init the data', function() {
            var t = testData;
            var u = [t[0], t[1], t[2]];
            var q = new hink.Queue(t[0], t[1], t[2]);
            testQueue(u, q);
        });

        it('should accept no args', function() {
            var q = new hink.Queue();
        });
    });

    describe('#deq', function() {
        it('should return and remove the element that is next to be dequeued', function() {
            var q = new hink.Queue(testData);
            assert.equal(q.peek, testData[0]);
            assert.equal(q.deq(), testData[0]);
            assert.equal(q.peek, testData[1]);
        });
    });

    describe('#enq', function() {
        it('should enqueue the element', function() {
            var q = new hink.Queue();
            assert.equal(q.peek, undefined);
            q.enq(testData[0]);
            assert.equal(q.peek, testData[0]);
        });
    });

    describe('#peek', function() {
        it('should return the element that is next to be dequeued', function() {
            var q = new hink.Queue(testData);
            assert.equal(q.peek, testData[0]);
            q.deq();
            assert.equal(q.peek, testData[1]);
        });
    });

    describe('#deplete', function() {
        it('should call the callback with each of the items in the Queue, thus depleting it', function() {
            var q = new hink.Queue(testData);
            var counter = 0;
            assert.equal(q.data.length, testData.length);
            q.deplete(function(element) {
                assert.equal(q, this);
                assert.equal(testData[counter], element);
                counter++;
            });
            assert.equal(q.data.length, 0);
        });
    });
});
