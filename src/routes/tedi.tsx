import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProtectedRoute from '../components/ProtectedRoute'
import {
  addExperience,
  addProject,
  addSkill,
  deleteExperience,
  deleteProject,
  deleteSkill,
  getPortfolioData,
  updateProfile,
} from '../components/queries'
import type {
  ExperiencePayload,
  ProfilePayload,
  ProjectPayload,
} from '../components/queries'

export const Route = createFileRoute('/tedi')({
  loader: () => (getPortfolioData as any)({ data: { language: 'tr' } }),
  component: AdminPanelWrapper,
})

function AdminPanelWrapper() {
  return (
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  )
}

function AdminPanel() {
  const data = Route.useLoaderData()
  const { i18n, t } = useTranslation()

  // Language state for Profile, Projects and Experience - sync with i18n language
  const [profileLanguage, setProfileLanguage] = useState<'en' | 'tr'>(
    i18n.language as 'en' | 'tr',
  )
  const [projectLanguage, setProjectLanguage] = useState<'en' | 'tr'>(
    i18n.language as 'en' | 'tr',
  )
  const [experienceLanguage, setExperienceLanguage] = useState<'en' | 'tr'>(
    i18n.language as 'en' | 'tr',
  )

  // Veritabanı boşsa formun çökmemesi için varsayılan değerlerle başlatıyoruz
  const [profile, setProfile] = useState<ProfilePayload>(() => {
    const defaultProfile: ProfilePayload = {
      name: '',
      roleLine: '',
      bio: '',
      email: '',
      githubUrl: '',
      linkedinUrl: '',
      location: t('admin.profile.defaultLocation'),
      school: '',
      department: '',
      years: '',
      gpa: '',
      language: profileLanguage,
    }
    return data.profile
      ? { ...data.profile, language: profileLanguage }
      : defaultProfile
  })
  const [isSaving, setIsSaving] = useState(false)
  const [newSkill, setNewSkill] = useState({ group: '', name: '' })
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [rawSkills, setRawSkills] = useState(data.rawSkills || [])
  const [newProject, setNewProject] = useState<Partial<ProjectPayload> | null>(
    null,
  )
  const [newExperience, setNewExperience] =
    useState<Partial<ExperiencePayload> | null>(null)
  const [projects, setProjects] = useState(data.projects || [])
  const [experience, setExperience] = useState(data.experience || [])

  // Sync language states with i18n language changes
  useEffect(() => {
    const lang = i18n.language as 'en' | 'tr'
    setProfileLanguage(lang)
    setProjectLanguage(lang)
    setExperienceLanguage(lang)
  }, [i18n.language])

  // Dil değiştiğinde veriyi yeniden yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const newData = await (getPortfolioData as any)({
          data: { language: profileLanguage },
        })
        const defaultProfile: ProfilePayload = {
          name: '',
          roleLine: '',
          bio: '',
          email: '',
          githubUrl: '',
          linkedinUrl: '',
          location: t('admin.profile.defaultLocation'),
          school: '',
          department: '',
          years: '',
          gpa: '',
          language: profileLanguage,
        }
        setProfile(
          newData.profile
            ? { ...newData.profile, language: profileLanguage }
            : defaultProfile,
        )
      } catch (error) {
        console.error('Failed to load profile data:', error)
      }
    }
    loadData()
  }, [profileLanguage, t])

  // Projects verilerini dile göre güncelle
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const newData = await (getPortfolioData as any)({
          data: { language: projectLanguage },
        })
        setProjects(newData.projects || [])
      } catch (error) {
        console.error('Failed to load projects:', error)
      }
    }
    loadProjects()
  }, [projectLanguage])

  // Experience verilerini dile göre güncelle
  useEffect(() => {
    const loadExperience = async () => {
      try {
        const newData = await (getPortfolioData as any)({
          data: { language: experienceLanguage },
        })
        setExperience(newData.experience || [])
      } catch (error) {
        console.error('Failed to load experience:', error)
      }
    }
    loadExperience()
  }, [experienceLanguage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // Server function çağrısı with language
      await (updateProfile as any)({
        data: { ...profile, language: profileLanguage },
      })
      // Veriyi yenilemek için yeniden yükle
      const newData = await (getPortfolioData as any)({
        data: { language: profileLanguage },
      })
      setProfile(newData.profile || profile)
      alert(t('admin.messages.profileUpdated'))
    } catch (error) {
      alert(t('admin.messages.profileUpdateFailed'))
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
      // Veriyi yeniden yükle ve state'i güncelle
      const newData = await (getPortfolioData as any)({
        data: { language: profileLanguage },
      })
      setRawSkills(newData.rawSkills || [])
      setNewSkill({ group: '', name: '' })
    } catch (error) {
      alert(t('admin.messages.skillAddFailed'))
    } finally {
      setIsAddingSkill(false)
    }
  }

  const handleDeleteSkill = async (id: number) => {
    if (!confirm(t('admin.messages.confirmDelete'))) return
    try {
      await (deleteSkill as any)({ data: { id } })
      // Veriyi yeniden yükle ve state'i güncelle
      const newData = await (getPortfolioData as any)({
        data: { language: profileLanguage },
      })
      setRawSkills(newData.rawSkills || [])
    } catch (error) {
      alert(t('admin.messages.skillDeleteFailed'))
    }
  }

  const handleAddProject = async () => {
    if (!newProject || !newProject.name || !newProject.description) return
    try {
      await (addProject as any)({
        data: {
          ...newProject,
          tech: newProject.tech || [],
          language: projectLanguage,
        },
      })
      // Veriyi yeniden yükle ve state'i güncelle
      const newData = await (getPortfolioData as any)({
        data: { language: projectLanguage },
      })
      setProjects(newData.projects || [])
      setNewProject(null)
      alert(t('admin.messages.projectAdded'))
    } catch (error) {
      alert(t('admin.messages.projectAddFailed'))
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm(t('admin.messages.confirmDelete'))) return
    try {
      await (deleteProject as any)({ data: { id } })
      // Veriyi yeniden yükle ve state'i güncelle
      const newData = await (getPortfolioData as any)({
        data: { language: projectLanguage },
      })
      setProjects(newData.projects || [])
    } catch (error) {
      alert(t('admin.messages.projectDeleteFailed'))
    }
  }

  const handleAddExperience = async () => {
    if (
      !newExperience ||
      !newExperience.role ||
      !newExperience.company ||
      !newExperience.period
    )
      return
    try {
      await (addExperience as any)({
        data: {
          ...newExperience,
          bullets: newExperience.bullets || [],
          order: 0,
          language: experienceLanguage,
        },
      })
      // Veriyi yeniden yükle ve state'i güncelle
      const newData = await (getPortfolioData as any)({
        data: { language: experienceLanguage },
      })
      setExperience(newData.experience || [])
      setNewExperience(null)
      alert(t('admin.messages.experienceAdded'))
    } catch (error) {
      alert(t('admin.messages.experienceAddFailed'))
    }
  }

  const handleDeleteExperience = async (id: number) => {
    if (!confirm(t('admin.messages.confirmDelete'))) return
    try {
      await (deleteExperience as any)({ data: { id } })
      // Veriyi yeniden yükle ve state'i güncelle
      const newData = await (getPortfolioData as any)({
        data: { language: experienceLanguage },
      })
      setExperience(newData.experience || [])
    } catch (error) {
      alert(t('admin.messages.experienceDeleteFailed'))
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-800 p-6 rounded-xl border border-white/10"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h2 className="text-xl font-semibold">
              {t('admin.profile.title')}
            </h2>
            <select
              value={profileLanguage}
              onChange={(e) =>
                setProfileLanguage(e.target.value as 'en' | 'tr')
              }
              className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm outline-none focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50">
                {t('admin.profile.name')}
              </label>
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
              <label className="text-xs text-white/50">
                {t('admin.profile.roleLine')}
              </label>
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
              <label className="text-xs text-white/50">
                {t('admin.profile.email')}
              </label>
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
              <label className="text-xs text-white/50">
                {t('admin.profile.location')}
              </label>
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
              <label className="text-xs text-white/50">
                {t('admin.profile.githubUrl')}
              </label>
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
              <label className="text-xs text-white/50">
                {t('admin.profile.linkedinUrl')}
              </label>
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
            <h3 className="text-sm font-medium text-white/70">
              {t('admin.education')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder={t('admin.profile.schoolPlaceholder')}
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
                placeholder={t('admin.profile.departmentPlaceholder')}
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
            <label className="text-xs text-white/50">
              {t('admin.profile.bio')}
            </label>
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
            {isSaving ? t('admin.profile.saving') : t('admin.profile.save')}
          </button>
        </form>

        {/* Skills Management Section */}
        <div className="mt-12 space-y-6 bg-gray-800 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-2">
            {t('admin.skills.title')}
          </h2>

          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              placeholder={t('admin.skills.groupPlaceholder')}
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={newSkill.group}
              onChange={(e) =>
                setNewSkill((prev) => ({ ...prev, group: e.target.value }))
              }
            />
            <input
              placeholder={t('admin.skills.skillNamePlaceholder')}
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
              {t('admin.skills.add')}
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {rawSkills?.map((skill: any) => (
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
                  {t('admin.skills.delete')}
                </button>
              </div>
            ))}
          </div>

          <div className="text-xs text-white/40 italic">
            {t('admin.skills.note')}
          </div>
        </div>

        {/* Projects Management Section */}
        <div className="mt-12 space-y-6 bg-gray-800 p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h2 className="text-xl font-semibold">
              {t('admin.projects.title')}
            </h2>
            <select
              value={projectLanguage}
              onChange={(e) =>
                setProjectLanguage(e.target.value as 'en' | 'tr')
              }
              className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm outline-none focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
            </select>
          </div>

          <div className="mt-4 space-y-3">
            {projects?.map((project: any) => (
              <div
                key={project.id}
                className="bg-white/5 border border-white/10 rounded p-3 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {project.name}
                    </p>
                    <p className="text-white/60 text-xs">{project.tagline}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    {t('admin.projects.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-medium text-white/70 mb-3">
              {t('admin.projects.addNew')} ({projectLanguage.toUpperCase()})
            </h3>
            <div className="space-y-2">
              <input
                placeholder={t('admin.projects.namePlaceholder')}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={newProject?.name || ''}
                onChange={(e) =>
                  setNewProject((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <textarea
                placeholder={t('admin.projects.descriptionPlaceholder')}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 h-20"
                value={newProject?.description || ''}
                onChange={(e) =>
                  setNewProject((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <input
                placeholder={t('admin.projects.techPlaceholder')}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={newProject?.tech?.join(', ') || ''}
                onChange={(e) =>
                  setNewProject((prev: any) => ({
                    ...prev,
                    tech: e.target.value
                      .split(',')
                      .map((tech: string) => tech.trim()),
                  }))
                }
              />
              <input
                placeholder={t('admin.projects.hrefPlaceholder')}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={newProject?.href || ''}
                onChange={(e) =>
                  setNewProject((prev: any) => ({
                    ...prev,
                    href: e.target.value,
                  }))
                }
              />
              <button
                onClick={handleAddProject}
                className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium transition"
              >
                {t('admin.projects.add')}
              </button>
            </div>
          </div>
        </div>

        {/* Experience Management Section */}
        <div className="mt-12 space-y-6 bg-gray-800 p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h2 className="text-xl font-semibold">
              {t('admin.experience.title')}
            </h2>
            <select
              value={experienceLanguage}
              onChange={(e) =>
                setExperienceLanguage(e.target.value as 'en' | 'tr')
              }
              className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm outline-none focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
            </select>
          </div>

          <div className="mt-4 space-y-3">
            {experience?.map((exp: any) => (
              <div
                key={exp.id}
                className="bg-white/5 border border-white/10 rounded p-3 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {exp.role} · {exp.company}
                    </p>
                    <p className="text-white/60 text-xs">
                      {exp.period}
                      {exp.location ? ` · ${exp.location}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    {t('admin.experience.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-medium text-white/70 mb-3">
              {t('admin.experience.addNew')} ({experienceLanguage.toUpperCase()}
              )
            </h3>
            <div className="space-y-2">
              <input
                placeholder={t('admin.experience.rolePlaceholder')}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={newExperience?.role || ''}
                onChange={(e) =>
                  setNewExperience((prev: any) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
              />
              <input
                placeholder={t('admin.experience.companyPlaceholder')}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={newExperience?.company || ''}
                onChange={(e) =>
                  setNewExperience((prev: any) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
              />
              <input
                placeholder={t('admin.experience.periodPlaceholder')}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={newExperience?.period || ''}
                onChange={(e) =>
                  setNewExperience((prev: any) => ({
                    ...prev,
                    period: e.target.value,
                  }))
                }
              />
              <input
                placeholder={t('admin.experience.locationPlaceholder')}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={newExperience?.location || ''}
                onChange={(e) =>
                  setNewExperience((prev: any) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
              <textarea
                placeholder={t('admin.experience.bulletsPlaceholder')}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 h-20 resize-y"
                value={newExperience?.bullets?.join('\n') || ''}
                onChange={(e) =>
                  setNewExperience((prev: any) => ({
                    ...prev,
                    bullets: e.target.value.split('\n'),
                  }))
                }
              />
              <button
                onClick={handleAddExperience}
                className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium transition"
              >
                {t('admin.experience.add')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
