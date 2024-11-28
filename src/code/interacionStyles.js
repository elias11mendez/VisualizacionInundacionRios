function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const histogramaArrow = document.getElementById("histogramaArrow");
  console.log("haciendo clic");

  histogramaArrow.classList.toggle("moved");

  sidebar.classList.toggle("open");
}

