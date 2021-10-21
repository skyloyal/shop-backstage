function convertOptions(originArr, conArr) {
  originArr.forEach(item => {
    var node = new Object();
    node.value = item.cat_id
    node.label = item.cat_name
    if (item.children) {
      node.children = []
      convertOptions(item.children, node.children)
    }
    conArr.push(node)
  });
}

var arr1 = [{
    "cat_id": 1,
    "cat_name": "大家电",
    "cat_pid": 0,
    "cat_level": 0,
    "cat_deleted": false,
    "children": [{
      "cat_id": 3,
      "cat_name": "电视",
      "cat_pid": 1,
      "cat_level": 1,
      "cat_deleted": false,
      "children": [{
          "cat_id": 6,
          "cat_name": "曲面电视",
          "cat_pid": 3,
          "cat_level": 2,
          "cat_deleted": false
        },
        {
          "cat_id": 7,
          "cat_name": "海信",
          "cat_pid": 3,
          "cat_level": 2,
          "cat_deleted": false
        }
      ]
    }]
  },
  {
    "cat_id": 2,
    "cat_name": "x家电",
    "cat_pid": 0,
    "cat_level": 0,
    "cat_deleted": false,
    "children": [{
      "cat_id": 3,
      "cat_name": "电视",
      "cat_pid": 1,
      "cat_level": 1,
      "cat_deleted": false,
      "children": [{
          "cat_id": 6,
          "cat_name": "曲面电视",
          "cat_pid": 3,
          "cat_level": 2,
          "cat_deleted": false
        },
        {
          "cat_id": 7,
          "cat_name": "海信",
          "cat_pid": 3,
          "cat_level": 2,
          "cat_deleted": false
        }
      ]
    }]
  }
]
var arr2 = []
convertOptions(arr1, arr2)
console.log(arr2)