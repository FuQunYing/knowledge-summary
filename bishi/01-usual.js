// 1. 判断质数，函数记忆的方式，如果hash对象中存在了直接返回，不存在了再进行for循环
var isPrime = (function() {
    var hash = {};
    return function(n) {
        if(!isNaN(n)&&n>1) {
            if(n<=3) return true;
            else if(n%2 === 0) return false;
            else if(hash[n]!==undefined) {
                console.log('不需要执行for循环');
                return hash[n];
            } else {
                console.log('执行for循环');
                for(var i = 3; i < Math.sqrt(n); i += 2) {
                    if(n%i === 0) {
                        hash[n] = false;
                        return false;
                    }
                }
                hash[n] = true;
                return true;
            }
        } else {
            console.log('数字需要大于1')
        }
    }
})();
// console.log(isPrime(113));

// 2. 插入排序
// 释义：有一个已经有序的数据序列，要求在这个已经排列好的数据列中插入一个数，但要求插入此数据序列仍然有序，这就用到 插入排序了。插入排序的基本操作就是将一个数据插入到已经排好的有序数据中，从而得到一个新的、个数加一的有序数据，算法适用于少量数据量的排序
// 插入算法要把排序的数组分成两部分：第一个部分包含了这个数组的所有元素，但将最后一个元素除外（让数组多一个空间才有插入的位置），而第二部分就只包含这个元素（即待插元素），在第一部分排序完成以后，再将这个最后元素插入到已排好序的第一部分中。
// 插入排序的基本思想是：每步将一个待排序的记录，按其关键码值的大小插入前面已经排序的文件中适当的位置上，直到全部插入为止。
var arr2 = [4,2,5,3,1];
function insertSort(arr) {
    for(var i = 1; i < arr.length; i++) {
        var t = arr[i];
        var p = i-1;
        while(p >= 0 && arr[p] >= t) {
            arr[p+1]=arr[p];
            p--;
        }
        arr[p+1] = t;
    }
}
// insertSort(arr2);
// console.log();

// 3. 快速排序
// 快速排序是对冒泡排序的一种改进，它的基本思想是通过一趟排序将要排序的的数据分割成独立的两部分，其中一部分所有的数据都比另外一部分所有数据都要小，然后按此方法对这两部分数据分别进行快速排序，整个排序可以递归进行，以此达到整个数据都变成有序数列。
var arr3 = [4,8,2,6,0,1,7];
function quickSort(arr) {
    if(arr.length <= 1) {
        return arr;
    } else {
            var center = parseInt((arr.length - 1)/2);
            var centerNum = arr.splice(center, 1)[0];
            console.log(center,centerNum);// 多次输出
            var left = [], right = [];
            for (var i = 0; i < arr.length; i++) {
                if(arr[i] <= centerNum) {
                    left.push(arr[i])
                } else {
                    right.push(arr[i])
                }
            }
            return quickSort(left).concat(centerNum,quickSort(right));//多次调用
    }
}
// console.log(quickSort(arr3))

// 4. 数组去重
var arr4 = [2,4,6,4,8,2];
var r = [];
var hash = {};
for( var i = 0; i < arr4.length; i++) {
    // 方式1 如果r中没有arr[i]
    /*if(r.indexOf(arr4[i]==-1)){// 本质上还是循环
        r.push(arr4[i]) // 将arr[i]push进r
    }*/
}
