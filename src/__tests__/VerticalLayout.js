/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import VerticalLayout from "../views/VerticalLayout"
import { localStorageMock } from "../__mocks__/localStorage.js"


describe('Given I am connected as Employee', () => {
  describe('When I am on a page showing vertical layout', () => {
    test("Then Icons should be rendered", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)
      const html = VerticalLayout(120)
      document.body.innerHTML = html
      expect(screen.getByTestId('icon-window')).toBeTruthy()
      expect(screen.getByTestId('icon-mail')).toBeTruthy()
    })
  })
})
