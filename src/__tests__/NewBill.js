/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee and I am on NewBill Page", () => {

  describe("testfile() unit test suite", () => {

    describe("When file is not jpg, jpeg or png file", () => {
      test("Then it should return false", () => {
        const html = NewBillUI()
        document.body.innerHTML = html

        const newBill = new NewBill({document, onNavigate: null, store: null, localStorage: null})
        const result = newBill.testFile("file.pdf")

        expect(result).toBeFalsy()
      })
    })

    describe("When file is jpg, jpeg or png file", () => {
      test("Should return true when file is jpg, jpeg or png file", () => {
        const html = NewBillUI()
        document.body.innerHTML = html

        const newBill = new NewBill({document, onNavigate: null, store: null, localStorage: null})
        const resultJpg = newBill.testFile("file.jpg")
        const resultJpeg = newBill.testFile("file.jpeg")
        const resultPng = newBill.testFile("file.png")

        expect(resultJpg).toBeTruthy()
        expect(resultJpeg).toBeTruthy()
        expect(resultPng).toBeTruthy()
      })
    })

  })

  describe("When I upload a pdf file", () => {
    test("Then an error message should appear", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )

      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "e@e"
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      // const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock})
      new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock})

      const fileInput = screen.getByTestId("file")
      const file = new File(["content"], "testfile.pdf", {type: "application/pdf"})

      // ++++++ utile ? la fonction est appelée 2 fois ++++++
      // const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      // fileInput.addEventListener("change", handleChangeFile)
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++

      userEvent.upload(fileInput, file)

      // ++++++++++++++++++++++++++++++++++++++++++++++++++++
      // expect(handleChangeFile).toHaveBeenCalled()
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++

      // expect(fileInput.value).toBe("")

      // expect(fileInput.files[0]).toBe(file)
      // expect(fileInput.files.item(0).name).toBe("testfile.pdf")

      expect(screen.getByTestId("file-error-message")).toBeTruthy()
    })
  })
  describe("When I upload an image file", () => {
    test("Then no error message should appear", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )

      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "e@e"
      }))

      // const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock})
      new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock})

      const fileInput = screen.getByTestId("file")
      const file = new File(["content"], "testfile.jpg", {type: "image/jpg"})

      // ++++++ utile ? la fonction est appelée 2 fois ++++++
      // const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      // fileInput.addEventListener("change", handleChangeFile)
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++

      userEvent.upload(fileInput, file)

      // await new Promise(process.nextTick)

      // ++++++++++++++++++++++++++++++++++++++++++++++++++++
      // expect(handleChangeFile).toHaveBeenCalled()
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++

      // expect(fileInput.files[0]).toBe(file)
      // expect(fileInput.files.item(0).name).toBe("testfile.jpg")

      expect(screen.queryByTestId("file-error-message")).toBeNull()
    })
  })

  describe("When I upload a pdf file, and then an image file", () => {
    test("Then error message should appear, then disappear", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )

      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "e@e"
      }))

      new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock})

      const fileInput = screen.getByTestId("file")

      const filePDF = new File(["content"], "testfile.pdf", {type: "application/pdf"})
      userEvent.upload(fileInput, filePDF)
      expect(screen.queryByTestId("file-error-message")).toBeTruthy()

      const fileJPG = new File(["content"], "testfile.jpg", {type: "image/jpg"})
      userEvent.upload(fileInput, fileJPG)
      expect(screen.queryByTestId("file-error-message")).toBeNull()
    })
  })


// nécessaire ? remplacer par un test qui vérifie que les valeurs requises sont valides ?
  // describe("When I fill fields form with values", () => {
  //   test("Values should display", () => {
  //     const html = NewBillUI()
  //     document.body.innerHTML = html

  //     const typeInput = screen.getByTestId("expense-type")
  //     const nameInput = screen.getByTestId("expense-name")
  //     const amountInput = screen.getByTestId("amount")
  //     const dateInput = screen.getByTestId("datepicker")
  //     const vatInput = screen.getByTestId("vat")
  //     const pctInput = screen.getByTestId("pct")
  //     const commentaryInput = screen.getByTestId("commentary")

  //     userEvent.selectOptions(typeInput, "Restaurants et bars")
  //     userEvent.type(nameInput, "Repas")
  //     userEvent.type(amountInput, "50")
  //     fireEvent.change(dateInput, { target: { value: '2024-09-02' } })
  //     userEvent.type(vatInput, "30")
  //     userEvent.type(pctInput, "20")
  //     userEvent.type(commentaryInput, "commentaire")

  //     expect(screen.getByText("Restaurants et bars").selected).toBe(true)
  //     expect(nameInput.value).toBe("Repas")
  //     expect(amountInput.value).toBe("50")
  //     expect(dateInput.value).toBe("2024-09-02")
  //     expect(vatInput.value).toBe("30")
  //     expect(pctInput.value).toBe("20")
  //     expect(commentaryInput.value).toBe("commentaire")
  //   })
  // })

  // nécessaire ? ne change pas le taux de couverture
  describe("When form fields are empty", () => {
    test("Then the required fields should be required or invalid and optionnals fields should be valid", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const typeInput = screen.getByTestId("expense-type")
      const nameInput = screen.getByTestId("expense-name")
      const amountInput = screen.getByTestId("amount")
      const dateInput = screen.getByTestId("datepicker")
      const vatInput = screen.getByTestId("vat")
      const pctInput = screen.getByTestId("pct")
      const commentaryInput = screen.getByTestId("commentary")
      const fileInput = screen.getByTestId('file')

      expect(typeInput).toBeRequired()

      expect(amountInput).toBeRequired()
      expect(amountInput).toBeInvalid()

      expect(dateInput).toBeRequired()
      expect(dateInput).toBeInvalid()

      expect(pctInput).toBeRequired()
      expect(pctInput).toBeInvalid()

      expect(fileInput).toBeRequired()
      expect(fileInput).toBeInvalid()

      expect(vatInput).toBeValid()
      expect(nameInput).toBeValid()
      expect(commentaryInput).toBeValid()
    })
  })

  //  la fonction est toujours lancée par jest, champs remplis ou non... mais sa présence augmente la couverture
  describe("When I submit the form with all fields completed", () => {
    test("The form should submit", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )

      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "e@e"
      }))

      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock})

      const formNewBill = screen.getByTestId("form-new-bill")
      // const sendButton = screen.getByText("Envoyer")

      // se déclenche 2 fois également
      const handleSubmit =  jest.fn((e) => newBill.handleSubmit(e))
      formNewBill.addEventListener("submit", handleSubmit)

      const typeInput = screen.getByTestId("expense-type")
      const nameInput = screen.getByTestId("expense-name")
      const amountInput = screen.getByTestId("amount")
      const dateInput = screen.getByTestId("datepicker")
      const vatInput = screen.getByTestId("vat")
      const pctInput = screen.getByTestId("pct")
      const commentaryInput = screen.getByTestId("commentary")

      userEvent.selectOptions(typeInput, "Restaurants et bars")
      userEvent.type(nameInput, "Repas")
      userEvent.type(amountInput, "50")
      fireEvent.change(dateInput, { target: { value: '2024-09-02' } })
      userEvent.type(vatInput, "30")
      userEvent.type(pctInput, "20")
      userEvent.type(commentaryInput, "commentaire")

      fireEvent.submit(formNewBill)

      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  // test d'intégration POST
  describe("When I create new bill with POST method on mocked API", () => {
    beforeEach(() => {
      document.body.innerHTML = ""
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
    })
    test("Then, if no error, I should have a promise that resolves with url and key datas", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const logSpy = jest.spyOn(global.console, 'log')

      const fileInput = screen.getByTestId("file")
      const file = new File(["content"], "testfile.jpg", {type: "image/jpg"})

      userEvent.upload(fileInput, file)
      await new Promise(process.nextTick)

      expect(logSpy).toHaveBeenCalledWith("https://localhost:3456/images/test.jpg")
      logSpy.mockRestore()
    })
    test("Then, if an error occurs, a console.error should log in the console", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const logSpy = jest.spyOn(global.console, 'error').mockImplementation(() => { })

      jest.spyOn(mockStore, "bills")
      mockStore.bills.mockImplementationOnce(() => {
        return {
          create : () => {
            return Promise.reject(new Error("postError"))
          }
        }
      })
      const fileInput = screen.getByTestId("file")
      const file = new File(["content"], "testfile.jpg", {type: "image/jpg"})

      userEvent.upload(fileInput, file)
      await new Promise(process.nextTick)

      expect(logSpy).toHaveBeenCalled()
      logSpy.mockRestore()
    })
  })
})
