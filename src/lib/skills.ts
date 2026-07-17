export type SkillGroup = {
  title: string
  items: Array<string>
}

// Skills'i frontend, backend, data sırasında sırala
export function groupAndSortSkills(
  skills: Array<{ group: string; name: string }>,
): Array<SkillGroup> {
  const grouped = skills.reduce<Array<SkillGroup>>((acc, skill) => {
    const group = acc.find((g) => g.title === skill.group)
    if (group) {
      group.items.push(skill.name)
    } else {
      acc.push({ title: skill.group, items: [skill.name] })
    }
    return acc
  }, [])

  const skillOrder = ['frontend', 'backend', 'data']
  grouped.sort((a, b) => {
    const aIndex = skillOrder.indexOf(a.title.toLowerCase())
    const bIndex = skillOrder.indexOf(b.title.toLowerCase())
    const aPos = aIndex === -1 ? 999 : aIndex
    const bPos = bIndex === -1 ? 999 : bIndex
    return aPos - bPos
  })

  return grouped
}
