/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
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

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })


    describe("When I click on the eye icon", () => {
      // test("Then the file's image should be displayed into modal", async () => {
      test("Then the file's image should be displayed into modal", () => {

        // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        // window.localStorage.setItem('user', JSON.stringify({
        //   type: 'Employee'
        // }))

        // const root = document.createElement("div")
        // root.setAttribute("id", "root")
        // document.body.append(root)
        // router()

        // window.onNavigate(ROUTES_PATH.Bills)

        // await waitFor(() => screen.getAllByTestId('icon-eye'))
        // const iconEyes = screen.getAllByTestId('icon-eye')

        // fireEvent.click(iconEyes[0])

        // // await waitFor(() => screen.getByAltText(`Bill`) )
        // expect(screen.getByAltText(`Bill`)).toBeTruthy()

        // ++++++++ v2 ++++++++

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
  })

})
