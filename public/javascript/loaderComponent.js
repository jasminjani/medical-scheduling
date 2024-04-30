
try {
  
( document.onreadystatechange =() =>{
      if (document.readyState !== "complete") {
    document.querySelector(
      "body").style.visibility = "hidden";
  document.querySelector(
  "#loader").style.visibility = "visible";
      } else {
    document.querySelector(
      "#loader").style.display = "none";
  document.querySelector(
  "body").style.visibility = "visible";
      }
  })();
} catch (error) {
    
}

  // Immediatly Invoked Function Expressions (IIFEs) 