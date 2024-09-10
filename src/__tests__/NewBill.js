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
  describe("When I am on NewBill Page", () => {
    test("Then mail icon should be highlightened", () => {
      document.body.innerHTML = ""
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      expect(screen.getByTestId("icon-mail")).toHaveClass("active-icon")
    })
    test("Then all fields should display", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getByTestId("expense-type")).toBeTruthy()
      expect(screen.getByTestId("expense-name")).toBeTruthy()
      expect(screen.getByTestId("amount")).toBeTruthy()
      expect(screen.getByTestId("datepicker")).toBeTruthy()
      expect(screen.getByTestId("vat")).toBeTruthy()
      expect(screen.getByTestId("pct")).toBeTruthy()
      expect(screen.getByTestId("commentary")).toBeTruthy()
      expect(screen.getByTestId("file")).toBeTruthy()
    })
    test("Then all required fields should be required", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getByTestId("expense-type")).toBeRequired()
      expect(screen.getByTestId("amount")).toBeRequired()
      expect(screen.getByTestId("datepicker")).toBeRequired()
      expect(screen.getByTestId("pct")).toBeRequired()
      expect(screen.getByTestId("file")).toBeRequired()
    })
  })
})

describe("Given I am connected as an employee and I am on NewBill Page", () => {
  describe("When a file name is tested with testfile()", () => {
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
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock})
      const fileInput = screen.getByTestId("file")
      const file = new File(["content"], "testfile.pdf", {type: "application/pdf"})

      const displayFileErrorMessage = jest.spyOn(newBill, "displayFileErrorMessage")
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

      fileInput.addEventListener("change", handleChangeFile)
      userEvent.upload(fileInput, file)

      expect(handleChangeFile).toHaveBeenCalled()
      expect(displayFileErrorMessage).toHaveBeenCalled()
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
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock})
      const fileInput = screen.getByTestId("file")
      const file = new File(["content"], "testfile.jpg", {type: "image/jpg"})

      const displayFileErrorMessage = jest.spyOn(newBill, "displayFileErrorMessage")
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      fileInput.addEventListener("change", handleChangeFile)
      userEvent.upload(fileInput, file)

      expect(handleChangeFile).toHaveBeenCalled()
      expect(displayFileErrorMessage).not.toHaveBeenCalled()
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

})
describe("Given I am connected as an employee and I am on NewBill Page", () => {
  describe("When I send form with all fields filled", () => {
    test("The form should be sent with correct values and I should be redirected to Bills page", async () => {
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
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      formNewBill.addEventListener("submit", handleSubmit)

      const handleSubmitSpy = jest.spyOn(newBill, "handleSubmit")
      const updateBillSpy = jest.spyOn(newBill, "updateBill")
      const onNavigateSpy = jest.spyOn(newBill, "onNavigate")

      const sentBill = {
        "email": undefined,
        "type": "Restaurants et bars",
        "name": "Repas",
        "amount": 50,
        "date": "2024-09-02",
        "vat": "30",
        "pct": 40,
        "commentary": "commentaire",
        "fileUrl": "https://localhost:3456/images/test.jpg",
        "fileName": "testfile.jpg",
        "status": "pending"
      }

      const file = new File(["content"], "testfile.jpg", {type: "image/jpg"})
      const fileInput = screen.getByTestId("file")

      userEvent.selectOptions(screen.getByTestId("expense-type"), "Restaurants et bars")
      userEvent.type(screen.getByTestId("expense-name"), "Repas")
      userEvent.type(screen.getByTestId("amount"), "50")
      fireEvent.change(screen.getByTestId("datepicker"), { target: { value: '2024-09-02' } })
      userEvent.type(screen.getByTestId("vat"), "30")
      userEvent.type(screen.getByTestId("pct"), "40")
      userEvent.type(screen.getByTestId("commentary"), "commentaire")
      userEvent.upload(fileInput, file)
      await new Promise(process.nextTick)

      fireEvent.submit(formNewBill)
      await new Promise(process.nextTick)

      expect(handleSubmitSpy).toHaveBeenCalledTimes(1)
      expect(updateBillSpy).toHaveBeenCalledWith(sentBill)
      expect(onNavigateSpy).toHaveBeenCalledWith(ROUTES_PATH['Bills'])
    })
  })
  describe("When I send form with all fields filled but 'pct' field", () => {
    test("Then the form should be sent with correct values - default value of 'pct' = 20 - and I should be redirected to Bills page", async () => {
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
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      formNewBill.addEventListener("submit", handleSubmit)

      const handleSubmitSpy = jest.spyOn(newBill, "handleSubmit")
      const updateBillSpy = jest.spyOn(newBill, "updateBill")
      const onNavigateSpy = jest.spyOn(newBill, "onNavigate")

      const sentBill = {
        "email": undefined,
        "type": "Restaurants et bars",
        "name": "Repas",
        "amount": 50,
        "date": "2024-09-02",
        "vat": "30",
        "pct": 20,
        "commentary": "commentaire",
        "fileUrl": "https://localhost:3456/images/test.jpg",
        "fileName": "testfile.jpg",
        "status": "pending"
      }

      const file = new File(["content"], "testfile.jpg", {type: "image/jpg"})
      const fileInput = screen.getByTestId("file")

      userEvent.selectOptions(screen.getByTestId("expense-type"), "Restaurants et bars")
      userEvent.type(screen.getByTestId("expense-name"), "Repas")
      userEvent.type(screen.getByTestId("amount"), "50")
      fireEvent.change(screen.getByTestId("datepicker"), { target: { value: '2024-09-02' } })
      userEvent.type(screen.getByTestId("vat"), "30")
      userEvent.type(screen.getByTestId("pct"), "")
      userEvent.type(screen.getByTestId("commentary"), "commentaire")
      userEvent.upload(fileInput, file)
      await new Promise(process.nextTick)

      fireEvent.submit(formNewBill)
      await new Promise(process.nextTick)

      expect(handleSubmitSpy).toHaveBeenCalledTimes(1)
      expect(updateBillSpy).toHaveBeenCalledWith(sentBill)
      expect(onNavigateSpy).toHaveBeenCalledWith(ROUTES_PATH['Bills'])
    })
  })

})

// test d'intégration POST
describe("Given I am connected as an employee and I am on NewBill Page", () => {
  describe("When I create new bill by uploading file with POST method on mocked API", () => {
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

      const logSpy = jest.spyOn(global.console, 'log')
      const errorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => { })

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

      expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
        message: "postError"
      }))
      expect(logSpy).not.toHaveBeenCalledWith("https://localhost:3456/images/test.jpg")
      errorSpy.mockRestore()
      logSpy.mockRestore()
    })

  })

  // test d'intégration PATCH
  describe("When I submit the form and use PATCH method to update the bill on mock API", () => {
    test("Then, if no error, updateBill() should be called and return no error", async () => {
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

      const updateBill = jest.spyOn(newBill, "updateBill")
      const logSpy = jest.spyOn(global.console, "log")

      const sendButton = screen.getByText("Envoyer")
      const file = new File(["content"], "testfile.jpg", {type: "image/jpg"})

      userEvent.selectOptions(screen.getByTestId("expense-type"), "Restaurants et bars")
      userEvent.type(screen.getByTestId("expense-name"), "Repas")
      userEvent.type(screen.getByTestId("amount"), "50")
      fireEvent.change(screen.getByTestId("datepicker"), { target: { value: '2024-09-02' } })
      userEvent.type(screen.getByTestId("vat"), "30")
      userEvent.type(screen.getByTestId("pct"), "20")
      userEvent.type(screen.getByTestId("commentary"), "commentaire")
      userEvent.upload(screen.getByTestId("file"), file)

      userEvent.click(sendButton)
      await new Promise(process.nextTick)

      expect(updateBill).toHaveBeenCalled()
      expect(logSpy).toHaveBeenNthCalledWith(1, 'e.target.querySelector(`input[data-testid="datepicker"]`).value', '2024-09-02')
      expect(logSpy).toHaveBeenNthCalledWith(2, 'https://localhost:3456/images/test.jpg')
      expect(logSpy).toHaveBeenCalledTimes(2)
      logSpy.mockRestore()
    })
    test("Then, if an error occured, updateBill() should be called and return an error", async () => {
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

      const updateBill = jest.spyOn(newBill, "updateBill")
      const logSpy = jest.spyOn(global.console, "log")
      const errorSpy = jest.spyOn(global.console, "error").mockImplementation(() => { })

      const sendButton = screen.getByText("Envoyer")
      const file = new File(["content"], "testfile.jpg", {type: "image/jpg"})

      userEvent.selectOptions(screen.getByTestId("expense-type"), "Restaurants et bars")
      userEvent.type(screen.getByTestId("expense-name"), "Repas")
      userEvent.type(screen.getByTestId("amount"), "50")
      fireEvent.change(screen.getByTestId("datepicker"), { target: { value: '2024-09-02' } })
      userEvent.type(screen.getByTestId("vat"), "30")
      userEvent.type(screen.getByTestId("pct"), "20")
      userEvent.type(screen.getByTestId("commentary"), "commentaire")
      userEvent.upload(screen.getByTestId("file"), file)

      await new Promise(process.nextTick)

      jest.spyOn(mockStore, "bills")
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update : () => {
            return Promise.reject(new Error("updateError"))
          }
        }
      })

      userEvent.click(sendButton)
      await new Promise(process.nextTick)

      expect(updateBill).toHaveBeenCalled()

      expect(logSpy).toHaveBeenNthCalledWith(1, 'https://localhost:3456/images/test.jpg')
      expect(logSpy).toHaveBeenNthCalledWith(2, 'e.target.querySelector(`input[data-testid="datepicker"]`).value', '2024-09-02')

      expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
        message: "updateError"
      }))

      logSpy.mockRestore()
      errorSpy.mockRestore()
    })
  })

})
