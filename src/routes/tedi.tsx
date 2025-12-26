import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  addSkill,
  deleteSkill,
  getPortfolioData,
  updateProfile,
} from '../components/queries'
import type { ProfilePayload } from '../components/queries'

export const Route = createFileRoute('/tedi')({
  loader: () => getPortfolioData(),
  component: AdminPanel,
})

function AdminPanel() {
  const data = Route.useLoaderData()
  const router = useRouter()

  // Veritabanı boşsa formun çökmemesi için varsayılan değerlerle başlatıyoruz
  const [profile, setProfile] = useState<ProfilePayload>(
    data.profile || {
      name: '',
      roleLine: '',
      bio: '',
      email: '',
      githubUrl: '',
      linkedinUrl: '',
      location: 'Türkiye',
      school: '',
      department: '',
      years: '',
      gpa: '',
    },
  )
  const [isSaving, setIsSaving] = useState(false)
  const [newSkill, setNewSkill] = useState({ group: '', name: '' })
  const [isAddingSkill, setIsAddingSkill] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // Server function çağrısı
      await (updateProfile as any)({ data: profile })
      // Veriyi yenilemek için router'ı invalidate et
      await router.invalidate()
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.group || !newSkill.name) return
    setIsAddingSkill(true)
    try {
      await (addSkill as any)({ data: newSkill })
      await router.invalidate()
      setNewSkill({ group: '', name: '' })
    } catch (error) {
      alert('Failed to add skill')
    } finally {
      setIsAddingSkill(false)
    }
  }

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try {
      await (deleteSkill as any)({ data: { id } })
      await router.invalidate()
    } catch (error) {
      alert('Failed to delete skill')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-800 p-6 rounded-xl border border-white/10"
        >
          <h2 className="text-xl font-semibold border-b border-white/10 pb-2">
            Edit Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50">Name</label>
              <input
                className="bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:border-blue-500 text-sm"
                value={profile.name || ''}
                onChange={(e) =>
                  setProfile((prev: ProfilePayload) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50">Role Line</label>
              <input
                className="bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:border-blue-500 text-sm"
                value={profile.roleLine || ''}
                onChange={(e) =>
                  setProfile((prev: ProfilePayload) => ({
                    ...prev,
                    roleLine: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50">Email</label>
              <input
                className="bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:border-blue-500 text-sm"
                value={profile.email || ''}
                onChange={(e) =>
                  setProfile((prev: ProfilePayload) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50">Location</label>
              <input
                className="bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:border-blue-500 text-sm"
                value={profile.location || ''}
                onChange={(e) =>
                  setProfile((prev: ProfilePayload) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50">GitHub URL</label>
              <input
                className="bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:border-blue-500 text-sm"
                value={profile.githubUrl || ''}
                onChange={(e) =>
                  setProfile((prev: ProfilePayload) => ({
                    ...prev,
                    githubUrl: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50">LinkedIn URL</label>
              <input
                className="bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:border-blue-500 text-sm"
                value={profile.linkedinUrl || ''}
                onChange={(e) =>
                  setProfile((prev: ProfilePayload) => ({
                    ...prev,
                    linkedinUrl: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-4">
            <h3 className="text-sm font-medium text-white/70">Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="School"
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={profile.school || ''}
                onChange={(e) =>
                  setProfile((prev: ProfilePayload) => ({
                    ...prev,
                    school: e.target.value,
                  }))
                }
              />
              <input
                placeholder="Department"
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={profile.department || ''}
                onChange={(e) =>
                  setProfile((prev: ProfilePayload) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/50">Bio</label>
            <textarea
              className="bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:border-blue-500 h-32 text-sm"
              value={profile.bio || ''}
              onChange={(e) =>
                setProfile((prev: ProfilePayload) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 py-3 rounded-lg font-semibold transition"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Skills Management Section */}
        <div className="mt-12 space-y-6 bg-gray-800 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-2">
            Manage Skills
          </h2>

          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              placeholder="Group (e.g. Frontend)"
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={newSkill.group}
              onChange={(e) =>
                setNewSkill((prev) => ({ ...prev, group: e.target.value }))
              }
            />
            <input
              placeholder="Skill Name"
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <button
              type="submit"
              disabled={isAddingSkill}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium transition"
            >
              Add
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {data.rawSkills?.map((skill: any) => (
              <div
                key={skill.id}
                className="flex items-center justify-between bg-white/5 px-3 py-2 rounded border border-white/5"
              >
                <span className="text-sm">
                  <span className="text-white/40">{skill.group}:</span>{' '}
                  {skill.name}
                </span>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="text-xs text-white/40 italic">
            * Skills are grouped by their group name in the UI.
          </div>
        </div>
      </div>
    </div>
  )
}
