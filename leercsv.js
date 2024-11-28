function parseCSV(text) {
    let lines = text.replace(/\r/g, '').split('\n');
    return lines.map(line => {
      let values = line.split(',');
      return values;
    });
  }
  
  function reverseMatrix(matrix){
    let output = [];
    matrix.forEach((values, row) => {
      values.forEach((value, col) => {
        if (output[col] === undefined) output[col] = [];
        output[col][row] = value;
      });
    });
    return output;
  }
  
  function readFile(evt) {
    let file = evt.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      let lines = parseCSV(e.target.result);
      let output = reverseMatrix(lines);
      console.log(output);
    };
    reader.readAsBinaryString(file);
  }
  
  document.getElementById