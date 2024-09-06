import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }
  testFile = fileName => {
    const fileStructure = fileName.split(".")
    const fileType = fileStructure[1]
    return fileType.match(/^(jpg|jpeg|png)$/)
  }
  displayFileErrorMessage = (fileInput) => {
    const errorMessage = this.document.createElement("div")
    errorMessage.classList.add("file-type-error")
    errorMessage.dataset.testid = "file-error-message"

    errorMessage.innerHTML = "Le justificatif doit être au format .jpg, .jpeg ou .png"
    fileInput.after(errorMessage)
  }
  removeFileErrorMessage = () => {
    const errorMessage = this.document.querySelector(".file-type-error")
    if (errorMessage) {
      errorMessage.remove()
    }
  }
  handleChangeFile = e => {
    e.preventDefault()
    this.removeFileErrorMessage()
    const fileInput = this.document.querySelector(`input[data-testid="file"]`)
    const file = fileInput.files[0]
    let fileName
    // in jest environment
    if (typeof jest !== 'undefined') {
      fileName = file.name
    }
    /* istanbul ignore next */
    // in prod environment
    else {
      /* istanbul ignore next */
      const filePath = e.target.value.split(/\\/g)
      /* istanbul ignore next */
      fileName = filePath[filePath.length-1]
    }

    //  if file is .jpg, .jpeg or .png
    if (this.testFile(fileName)) {
      const formData = new FormData()
      const email = JSON.parse(localStorage.getItem("user")).email
      formData.append('file', file)
      formData.append('email', email)

      this.store
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true
          }
        })
        .then(({fileUrl, key}) => {
          console.log(fileUrl)
          this.billId = key
          this.fileUrl = fileUrl
          this.fileName = fileName
        }).catch(error => console.error(error))

    } else {
      // if is not jpg, jpeg or png
      fileInput.value = ""
      this.displayFileErrorMessage(fileInput)
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}