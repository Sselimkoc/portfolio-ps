import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import {
  Home,
  Menu,
  Network,
  SquareFunction,
  StickyNote,
  X,
} from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="ml-4 text-xl font-bold">Portfolio OS</h1>
      </header>
      {isOpen && (
        <nav className="p-4 bg-gray-800 text-white shadow-lg">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center p-2 rounded hover:bg-gray-700"
              >
                <Home size={20} />
                <span className="ml-2">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="flex items-center p-2 rounded hover:bg-gray-700"
              >
                <Network size={20} />
                <span className="ml-2">Projects</span>
              </Link>
            </li>
            <li>
              <Link
                to="/skills"
                className="flex items-center p-2 rounded hover:bg-gray-700"
              >
                <SquareFunction size={20} />
                <span className="ml-2">Skills</span>
              </Link>
            </li>
            <li>
              <Link
                to="/notes"
                className="flex items-center p-2 rounded hover:bg-gray-700"
              >
                <StickyNote size={20} />
                <span className="ml-2">Notes</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  )
}
