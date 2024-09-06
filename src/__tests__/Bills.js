/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js"
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills page, but page is loading", () => {
    test("Then, Loading page should be rendered", () => {
      document.body.innerHTML = BillsUI({ loading: true })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe("When I am on Bills page, back-end send an error message", () => {
    test("Then, Then, Error page should be rendered", () => {
      document.body.innerHTML = BillsUI({ error: 'some error message' })
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toHaveClass('active-icon')
    })
    test("Then all my bills should appear", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      expect(screen.getByText("encore")).toBeTruthy()
      expect(screen.getByText("test1")).toBeTruthy()
      expect(screen.getByText("test3")).toBeTruthy()
      expect(screen.getByText("test2")).toBeTruthy()
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe("Given I am connected as an employee and I am on Bills Page", () => {
  describe("When I click on the eye icon", () => {
    test("Then the file's image should be displayed into modal", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = BillsUI({ data: bills })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const billsDashboard = new Bills({document, onNavigate, store: null, localStorage: localStorageMock})

      const handleClickIconEye = jest.fn((e) => billsDashboard.handleClickIconEye(e.target))
      const iconEyes = screen.getAllByTestId('icon-eye')
      iconEyes[0].addEventListener("click", handleClickIconEye)
      userEvent.click(iconEyes[0])

      expect(handleClickIconEye).toHaveBeenCalled()
      expect(screen.getByAltText(`Bill`)).toBeTruthy()
    })
  })
  describe("When I click on 'Nouvelle note de frais'", () => {
    test("Then I should be redirected to New Bill page and the new bill form should display", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = BillsUI({ data: bills })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const billsDashboard = new Bills({document, onNavigate, store: null, localStorage: localStorageMock})

      const onNavigateSpy = jest.spyOn(billsDashboard, "onNavigate")

      const handleClickNewBill = jest.fn(() => billsDashboard.handleClickNewBill())
      const buttonNeWBill = screen.getByTestId("btn-new-bill")
      buttonNeWBill.addEventListener("click", handleClickNewBill)
      userEvent.click(buttonNeWBill)

      expect(handleClickNewBill).toHaveBeenCalled()
      expect(onNavigateSpy).toHaveBeenCalledWith(ROUTES_PATH['NewBill'])
      expect(screen.getByTestId("form-new-bill")).toBeTruthy()
    })
  })
})

// test d'intégration GET
jest.mock("../app/store", () => mockStore)

describe("Given I am a user connected as Employee and I navigate to Bills Page", () => {
  describe("When app fetches bills from mock API GET", () => {
    test("Then all bills should display", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getByText("Mes notes de frais"))

      const firstBill  = await screen.getByText("encore")
      expect(firstBill).toBeTruthy()
      const secondBill  = await screen.getByText("test1")
      expect(secondBill).toBeTruthy()
      const thirdBill  = await screen.getByText("test3")
      expect(thirdBill).toBeTruthy()
      const fourthBill  = await screen.getByText("test2")
      expect(fourthBill).toBeTruthy()
    })
  })
  describe("When app fetches bills from mock API GET and an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })

    // La ressource est introuvable
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    // la version du protocole HTTP utilisée dans la requête n'est pas prise en charge par le serveur
    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
