import type { LocationType } from '@/game/types';


export const titleHeroImage = new URL('./generated/title/title_hero_teacher_back.png', import.meta.url).href;

export const prologueImages = [
  new URL('./generated/prologue/prologue_01_school_gate.png', import.meta.url).href,
  new URL('./generated/prologue/prologue_02_hallway_greeting.png', import.meta.url).href,
  new URL('./generated/prologue/prologue_03_first_class.png', import.meta.url).href,
  new URL('./generated/prologue/prologue_04_staff_room_papers.png', import.meta.url).href,
  new URL('./generated/prologue/prologue_05_colleague_request.png', import.meta.url).href,
  new URL('./generated/prologue/prologue_06_parent_messages.png', import.meta.url).href,
  new URL('./generated/prologue/prologue_07_many_duties.png', import.meta.url).href,
  new URL('./generated/prologue/prologue_08_classroom_after_school.png', import.meta.url).href,
  new URL('./generated/prologue/prologue_09_30_days_begin.png', import.meta.url).href,
] as const;

export const locationImages = {
  classroom: new URL('./generated/locations/location_classroom.png', import.meta.url).href,
  office: new URL('./generated/locations/location_office.png', import.meta.url).href,
  health_room: new URL('./generated/locations/location_health_room.png', import.meta.url).href,
  playground: new URL('./generated/locations/location_playground.png', import.meta.url).href,
  principal_room: new URL('./generated/locations/location_principal_room.png', import.meta.url).href,
  admin_office: new URL('./generated/locations/location_admin_office.png', import.meta.url).href,
  cafeteria: new URL('./generated/locations/location_cafeteria.png', import.meta.url).href,
  library: new URL('./generated/locations/location_library.png', import.meta.url).href,
  wee_class: new URL('./generated/locations/location_wee_class.png', import.meta.url).href,
  science_lab: new URL('./generated/locations/location_science_lab.png', import.meta.url).href,
  school_gate: new URL('./generated/locations/location_school_gate.png', import.meta.url).href,
  gym_room: new URL('./generated/locations/location_gym_room.png', import.meta.url).href,
  gymnasium: new URL('./generated/locations/location_gymnasium.png', import.meta.url).href,
  class_grade1: new URL('./generated/locations/location_class_grade1.png', import.meta.url).href,
  class_grade2: new URL('./generated/locations/location_class_grade2.png', import.meta.url).href,
  class_grade3: new URL('./generated/locations/location_class_grade3.png', import.meta.url).href,
  class_grade4: new URL('./generated/locations/location_class_grade4.png', import.meta.url).href,
  class_grade5: new URL('./generated/locations/location_class_grade5.png', import.meta.url).href,
  class_grade6: new URL('./generated/locations/location_class_grade6.png', import.meta.url).href,
} as const satisfies Record<LocationType, string>;

export const endingImages = {
  ending_gameover_hp: new URL('./generated/endings/ending_gameover_hp.png', import.meta.url).href,
  ending_gameover_mental: new URL('./generated/endings/ending_gameover_mental.png', import.meta.url).href,
  ending_gameover_burnout: new URL('./generated/endings/ending_gameover_burnout.png', import.meta.url).href,
  ending_gameover_complaint: new URL('./generated/endings/ending_gameover_complaint.png', import.meta.url).href,
  ending_true_mentor: new URL('./generated/endings/ending_true_mentor.png', import.meta.url).href,
  ending_legendary_mentor: new URL('./generated/endings/ending_legendary_mentor.png', import.meta.url).href,
  ending_labor_union_leader: new URL('./generated/endings/ending_labor_union_leader.png', import.meta.url).href,
  ending_supervisor: new URL('./generated/endings/ending_supervisor.png', import.meta.url).href,
  ending_administrator: new URL('./generated/endings/ending_administrator.png', import.meta.url).href,
  ending_best_selling_author: new URL('./generated/endings/ending_best_selling_author.png', import.meta.url).href,
  ending_expert: new URL('./generated/endings/ending_expert.png', import.meta.url).href,
  ending_innovator: new URL('./generated/endings/ending_innovator.png', import.meta.url).href,
  ending_office_master: new URL('./generated/endings/ending_office_master.png', import.meta.url).href,
  ending_peacekeeper: new URL('./generated/endings/ending_peacekeeper.png', import.meta.url).href,
  ending_family_first: new URL('./generated/endings/ending_family_first.png', import.meta.url).href,
  ending_coop_star: new URL('./generated/endings/ending_coop_star.png', import.meta.url).href,
  ending_great_escapist: new URL('./generated/endings/ending_great_escapist.png', import.meta.url).href,
  ending_burnout: new URL('./generated/endings/ending_burnout.png', import.meta.url).href,
  ending_family_rupture: new URL('./generated/endings/ending_family_rupture.png', import.meta.url).href,
  ending_hobbyist: new URL('./generated/endings/ending_hobbyist.png', import.meta.url).href,
  ending_sustainable: new URL('./generated/endings/ending_sustainable.png', import.meta.url).href,
  ending_class_master: new URL('./generated/endings/ending_class_master.png', import.meta.url).href,
  ending_teaching_scholar: new URL('./generated/endings/ending_teaching_scholar.png', import.meta.url).href,
  ending_family_peacekeeper: new URL('./generated/endings/ending_family_peacekeeper.png', import.meta.url).href,
  ending_innovation_director: new URL('./generated/endings/ending_innovation_director.png', import.meta.url).href,
  ending_myway: new URL('./generated/endings/ending_myway.png', import.meta.url).href,
  ending_general: new URL('./generated/endings/ending_general.png', import.meta.url).href,
} as const;

export type EndingImageId = keyof typeof endingImages;

export const uiImages = {
  chalkboardLogoPanel: new URL('./generated/ui/ui_chalkboard_logo_panel.png', import.meta.url).href,
  paperCardFrame: new URL('./generated/ui/ui_paper_card_frame.png', import.meta.url).href,
  postitSet: new URL('./generated/ui/ui_postit_set.png', import.meta.url).href,
  stampUnlocked: new URL('./generated/ui/ui_stamp_unlocked.png', import.meta.url).href,
  lockEnding: new URL('./generated/ui/ui_lock_ending.png', import.meta.url).href,
  teacherHandCursor: new URL('./generated/ui/ui_teacher_hand_cursor.png', import.meta.url).href,
} as const;

