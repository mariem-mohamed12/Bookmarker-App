let siteNameInput = document.getElementById("siteName");
let siteUrlInput = document.getElementById("siteUrl");
let searchInput = document.getElementById("search");
let updateBtn = document.getElementById("update");
let addBtn = document.getElementById("add");

let allItems = [];
let currIndex = 0;

//create read  delete  search update  ( validation )

if (localStorage.getItem("item")) {
  allItems = JSON.parse(localStorage.getItem("item"));
  display();
}

function addItem() {
  if (validation(siteNameInput) && validation(siteUrlInput)) {
    let bookmark = {
      siteName: siteNameInput.value.trim(),
      siteURL: siteUrlInput.value.trim(),
    };
    allItems.push(bookmark);
    localStorage.setItem("item", JSON.stringify(allItems));
    display();
    clear();
  } else {
    Swal.fire({
      title: "<span class='gradient-text'>Site Name or Url is not valid</span>",
      html: `<p>Please follow the rules below:</p>
              <ul style="text-align: left;">
                <li>Site name must contain at least 3 characters</li>
                <li>Site URL must be a valid one</li>
              </ul>
            `,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        popup: "swal-small",
      },
    });
  }
}

function display() {
  let cartona = "";
  for (let i = 0; i < allItems.length; i++) {
    cartona += createCols(i);
  }

  document.getElementById("items").innerHTML = cartona;
}

function createCols(i) {
  return `   <tr>
                            <td>
                                 ${i + 1} 
                            </td>
                            <td>
                                 ${allItems[i].siteName} 
                            </td>
                            <td>
                               <button class="btn text-white bg-success bg-opacity-75">
                            <a href="${
                              allItems[i].siteURL
                            }" target="_blank" class="text-white text-decoration-none"><i class="fa-solid fa-eye"></i>
                            <span>Visit</span> </a>
                        </button>
                            </td>
                            <td>
                                <button class="btn bg-danger  text-white py-1" onclick="deleteItem( ${i} )">
                                    <i class="fa-solid fa-trash-can"></i>
                                   Delete
                                </button>
                            </td>
                             <td>
                                <button class="btn bg-warning text-white py-1" onclick="setUpdate( ${i} )" >
                                    <i class="fa-solid fa-pen-to-square"></i>
                                  Update
                                </button>
                            </td>
            </tr>
         `;
}

function clear() {
  siteNameInput.value = null;
  siteUrlInput.value = null;
  siteNameInput.classList.remove("is-valid");
  siteUrlInput.classList.remove("is-valid");
}

function deleteItem(index) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success mx-2",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        allItems.splice(index, 1);
        localStorage.setItem("item", JSON.stringify(allItems));
        display();
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
    });
}

function searchWithName() {
  let term = searchInput.value.trim();
  let cartona = "";
  for (let i = 0; i < allItems.length; i++) {
    if (allItems[i].siteName.toLowerCase().includes(term.toLowerCase())) {
      cartona += createCols(i);
    }
  }

  document.getElementById("items").innerHTML = cartona;
}

function setUpdate(i) {
  currIndex = i;
  siteNameInput.value = allItems[i].siteName;
  siteUrlInput.value = allItems[i].siteURL;
  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

function updateItem() {
  let bookmark = {
    siteName: siteNameInput.value.trim(),
    siteURL: siteUrlInput.value.trim(),
  };
  allItems.splice(currIndex, 1, bookmark);
  localStorage.setItem("item", JSON.stringify(allItems));
  display();
  addBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
  clear();
}

function validation(element) {
  let text = element.value.trim();
  let regex = {
    siteName: /^.{3,}$/,
    siteUrl:
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/,
  };

  if (regex[element.id].test(text)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    return true;
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    return false;
  }
}
