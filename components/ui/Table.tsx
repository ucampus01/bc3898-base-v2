// components/ui/Table.tsx
// 테이블 컴포넌트

import { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  className?: string
}

export default function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>
        {children}
      </table>
    </div>
  )
}

// 테이블 헤더
export function TableHeader({ children, className = '' }: TableProps) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  )
}

// 테이블 바디
export function TableBody({ children, className = '' }: TableProps) {
  return (
    <tbody className={`divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  )
}

// 테이블 행
export function TableRow({ children, className = '' }: TableProps) {
  return (
    <tr className={`hover:bg-gray-50 transition ${className}`}>
      {children}
    </tr>
  )
}

// 테이블 헤더 셀
export function TableHead({ children, className = '' }: TableProps) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  )
}

// 테이블 데이터 셀
export function TableCell({ children, className = '' }: TableProps) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
      {children}
    </td>
  )
}