import { create } from 'zustand'

// Create this so we can use it to change settings and receive achievements
const useUserStore = create((set) => ({
    user: undefined,
    avatarsvg: {undefined},
    stats: {total_journal: 0, total_journal_prompt: 0, total_mood: 0, total_checklist: 0, total_checklist_completed: 0, total_goal: 0, total_goal_completed: 0},
    settings: {color: "", haptics: true, notifications: true},
    color: {undefined},
    setColor: (color) => set({color}),
    setAvatarsvg: (avatarsvg) => set({avatarsvg}),
    setUser: (user) => set({user}),
    setStats: (stats) => set({stats}),
    setAvatar: (avatar) => set((store) => ({ user: { ...store.user, avatar_svg: JSON.stringify(avatar.avatar_svg), avatar_extra: JSON.stringify(avatar.avatar_extra) } })),
    updateStats: (stat) => set((store) => ({ stats: { ...store.stats, [stat]: store.stats[stat] + 1}})), // We increment the variable passed in by one
    clearStats: (stat) => set((store) => ({ stats: { ...store.stats, [stat]: 0}})),
    updateLogs: (log) => set((store) => ({ logs: { ...store.logs, log}})),
    deleteUser: () => set({user: undefined}),
    updateSettings: (setting, value) => set((store) => ({ settings: {...store.settings, [setting]: value}})),
    resetStats: () => set((store) => ({ stats: {total_journal: 0, total_mood: 0, total_checklist: 0, total_checklist_completed: 0, total_goal: 0, total_goal_completed: 0}}))
}))

const useJournalStore = create((set) => ({
    entries: [],
    setEntry: (entries) => set({entries}),
    addEntry: (title, body, date, uuid) => set((store) => ({ entries: [{ title, body, date, uuid }, ...store.entries]})),
    removeEntry: (uuid) => set((store) => ({entries: store.entries.filter((entry) => entry.uuid !== uuid)})),
}))
const useChatStore = create((set) => ({
    chats: [],
    messages: [],
    setChats: (chats) => set({chats}),
    addChat: (chat_id, title, date) => set((store) => ({ chats: [{ chat_id, title, date}, ...store.chats]})),
    removeChat: (chat_id) => set((store) => ({chats: store.chats.filter((chat) => chat.chat_id !== chat_id)})),
}))

const useGoalStore = create((set) => ({
    goals: [],
    goalSteps: [], // Used for goals accomplished through step completion
    completedGoals: [], // Used for repeating goals
    setGoals: (goals) => set({goals}),
    setGoalSteps: (goalSteps) => set({goalSteps}),
    setCompletedGoals: (completedGoals) => set({completedGoals}),
    addGoal: (title, amount, occurrence_level, start_date, complete_on, reminder, tag, goal_id, type) => set((store) => ({ goals: [ { title, amount, occurrence_level, start_date, complete_on, reminder, tag, goal_id, type }, ...store.goals ]})),
    addCompletedGoal: (goal_id, date_completed, log_num, note) => set((store) => ({completedGoals: [{ goal_id, date_completed, log_num, note}, ...store.completedGoals, ]})),
    updateRepeatingGoal: (goal) => set((store) => ({goals: store.goals.map((item) => item.goal_id === goal.goal_id ? { ...goal } : item)})),
    updateCompletedGoal: (completedGoal) => set((store) => ({completedGoals: store.completedGoals.map((item) => (item.log_num === completedGoal.log_num && item.goal_id === completedGoal.goal_id ? completedGoal : item))})),
    removeCompletedGoal: (goal_id, log_num) => set((store) => ({
        completedGoals: store.completedGoals.filter((completedGoal) => (
            !(completedGoal.goal_id === goal_id && completedGoal.log_num === log_num)
        ))
    })),
    addGoalSteps: (goal_id, steps) => set((store) => ({goalSteps: [...store.goalSteps, {goal_id, steps}]})),
    removeGoal: (goal_id) => set((store) => ({goals: store.goals.filter((goal) => goal.goal_id !== goal_id)})),
    removeCompleteGoals: (goal_id) => set((store) => store.completedGoals.filter((goal) => goal.goal_id !== goal_id)),
    removeGoalSteps: (goal_id) => set((store) => store.goalSteps.filter((goal) => goal.goal_id !== goal_id)),

    // Marks the entire goal as complete (goalStep goals only)
    completeGoal: (goal_id) => set((store) => ({goals: store.goals.map((goal) => goal.goal_id === goal_id ? {...goal, is_completed: 1, complete_on: new Date().toISOString() } : goal)})),
    incompleteGoal:(goal_id) => set((store) => ({goals: store.goals.map((goal) => goal.goal_id === goal_id ? {...goal, is_completed: 0, complete_on: null } : goal)})),

    // Mark goal step as complete
    completeGoalStep: (step_id) => set((store) => {
        let tmp = [...store.goalSteps]
        for (let i = 0; i < store.goalSteps.length; i++) {
            if (tmp[i].step_id === step_id) {
                tmp[i].completed_date = new Date().toISOString()
                tmp[i].is_completed = 1
            }
        }
        return {goalSteps: tmp}
    }),

    // Mark goal step as incomplete
    incompleteGoalStep: (step_id) => set((store) => {
        let tmp = [...store.goalSteps]
        for (let i = 0; i < store.goalSteps.length; i++) {
            if (tmp[i].step_id === step_id) {
                tmp[i].completed_date = null
                tmp[i].is_completed = 0
            }
        }
        return {goalSteps: tmp}
    }),
    removeAllGoalSteps: () => set(() => ({goalSteps: []})),
    destroy: () => set(() => ({goals: [], goalSteps: [], completedGoals: []}))
}))

const useCheckListStore = create((set) => ({
    checklist: [],
    setChecklist: (checklist) => set({checklist}),
    addChecklist: (checklist) => set((store) => ({ checklist: [ checklist , ...store.checklist]})),
    removeChecklist: (checklist_id) => set((store) => ({ checklist: store.checklist.filter((item) => item.checklist_id !== checklist_id)})),
    toggleCompletion: (checklist_id) => set((store) => ({
        checklist: store.checklist.map((item) => item.checklist_id === checklist_id ? { ...item, is_completed: !item.is_completed, date_completed: new Date().toISOString() } : item),
    }))
    // removeChecklist: () => set(() =>( { checklist: []}))
}))

const useMoodTrackerStore = create((set) => ({
    moods: [],
    setMoods: (moods) => set({moods}),
    addMood: (mood) => set((store) => ({ moods: [ mood , ...store.moods]})),
    updateMood: (mood) => set((store) => ({
        moods: store.moods.map((item) => (item.mood_id === mood.mood_id ? { ...item, ...mood } : item)),
      })),
    removeMood: (mood_id) => set((store) => ({ moods: store.moods.filter((item) => item.mood_id !== mood_id)})),
}))

const useAchievementStore = create((set) => ({
    achieved: [],
    setAchieved: (achieved) => set({achieved}),
    addAchieved: (achieved) => set((store) => ({ achieved: [achieved, ...store.achieved ]})),
    clearAchieved: () => set((store) => ({achieved: []}))
}))

export { useUserStore, useJournalStore, useChatStore, useGoalStore, useCheckListStore, useMoodTrackerStore, useAchievementStore }
