# How to upload Photos

1. Copy the photos (*.jpg) inside your Folder
   1. Franz: `assets/img/f`
   2. Eleasar: `assets/img/e`
2. Update the `data.json` file:

Before:
```
{
    "e": [],
    "f": [],
    "y": [{
        "data": "Name: Khasbulatov\n",
        "path": "assets/img/y/y1.jpg"
    }, {
        "data": "Name: Khasbulatov\n",
        "path": "assets/img/y/y2.jpg"
    }, {
        "data": "Name: Khasbulatov\n",
        "path": "assets/img/y/y3.jpg"
    }]
}
```

After
```
{
    "e": [{
        "data": "Name: Blum\n",
        "path": "assets/img/e/e1.jpg"
    }, {
        "data": "Name: Blum\n",
        "path": "assets/img/e/e2.jpg"
    }, {
        "data": "Name: Blum\n",
        "path": "assets/img/e/e3.jpg"
    }],
    "f": [{
        "data": "Name: Kilchenmann\n",
        "path": "assets/img/f/f1.jpg"
    }, {
        "data": "Name: Kilchenmann\n",
        "path": "assets/img/f/f2.jpg"
    }, {
        "data": "Name: Kilchenmann\n",
        "path": "assets/img/f/f3.jpg"
    }],
    "y": [{
        "data": "Name: Khasbulatov\n",
        "path": "assets/img/y/y1.jpg"
    }, {
        "data": "Name: Khasbulatov\n",
        "path": "assets/img/y/y2.jpg"
    }, {
        "data": "Name: Khasbulatov\n",
        "path": "assets/img/y/y3.jpg"
    }]
}
```
