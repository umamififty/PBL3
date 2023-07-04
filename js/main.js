function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.body.style.backgroundColor = "#313131";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.body.style.backgroundColor = "#313131";
}

function openModal() {
  modal.style.height = '75%';
  // document.body.style.opacity = '0.5';
}

function closeModal() {
  var modal = document.getElementById('modal');
  modal.style.height = '0%';
  document.body.style.backgroundColor = "#313131";
  document.body.style.color = "#ffffff";
}
