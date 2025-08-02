'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function UserManagement() {
  const supabase = createClient()
  const itemsPerPage = 2

  const [searchValue, setSearchValue] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [numberOfUsers, setNumberOfUsers] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const userSupabaseQuery = () => {
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })

    if (searchValue) {
      query = query.ilike('firstname', `%${searchValue}%`)
    }

    query = query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1)

    return query
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: usersData, error, count } = await userSupabaseQuery()

      if (error) {
        setError(error.message)
        return
      }

      setUsers(usersData || [])
      setNumberOfUsers(count || 1)
    } catch (err) {
      setError('Unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value)
  }

  const searchUser = async () => {
    setPage(1)
    await fetchUsers()
  }

  const totalPages = Math.ceil(numberOfUsers / itemsPerPage)

  return (
    <div className="flex-1 flex flex-col gap-10 px-3 animate-fade-in">
      <div className="flex gap-2 items-center mt-5">
        <input
          className="rounded-md px-4 py-2 bg-white text-black border w-full"
          type="text"
          placeholder="Search by firstname"
          onChange={handleSearchChange}
        />
        <button
          onClick={searchUser}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-500">No users found</div>
      ) : (
        <main className="flex-1 flex flex-col gap-6">
          <table className="table-auto border-collapse border border-gray-200 w-full">
            <thead>
              <tr>
                <th className="border border-gray-200 px-4 py-2">ID</th>
                <th className="border border-gray-200 px-4 py-2">First Name</th>
                <th className="border border-gray-200 px-4 py-2">Last Name</th>
                <th className="border border-gray-200 px-4 py-2">Email</th>
                <th className="border border-gray-200 px-4 py-2">Telephone</th>
                <th className="border border-gray-200 px-4 py-2">Attachment</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.firstname}</td>
                  <td className="border px-4 py-2">{user.lastname}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.tel}</td>
                  <td className="border px-4 py-2">
                    {user.attachments && <a
                      href={user.attachments}
                      className="text-blue-500 underline"
                      target="_blank"
                    >
                      Download file
                    </a>}
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-5 py-5 flex flex-col xs:flex-row items-center xs:justify-between">
            <span className="text-sm">
              Page {page} / {totalPages} ({numberOfUsers} users)
            </span>
            <div className="inline-flex mt-2 xs:mt-0">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="text-sm font-bold uppercase px-3 py-1 rounded border mr-2 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages}
                className="text-sm font-bold uppercase px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
