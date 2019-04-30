db.passageiros.insert(
    {
    _id: "P1",
    "nome": "Mary Anne",
    "loc": {
    type: "Point",
    "coordinates": [125.6, 10.1]
    } 
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.6, 10.1]
      },
      "properties": {
        "name": "Mary Anne"
      }
    }
    ) 
     
    db.passageiros.find()