import { createClient } from '@supabase/supabase-js';
import { Student, Activity, AuditLogItem } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.includes('supabase.co') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Serviço de integração com o banco de dados Supabase (PostgreSQL)
 * com fallback inteligente para localStorage quando offline ou não configurado.
 */
export class SupabaseDataService {
  /**
   * Testa a conectividade com o banco do Supabase
   */
  static async testConnection(): Promise<{ connected: boolean; message: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        connected: false,
        message: 'Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas no .env',
      };
    }
    try {
      const { data, error } = await supabase.from('teachers').select('id').limit(1);
      if (error) throw error;
      return {
        connected: true,
        message: 'Conectado com sucesso ao Supabase PostgreSQL!',
      };
    } catch (e: any) {
      return {
        connected: false,
        message: `Falha na conexão: ${e.message || 'Verifique as chaves e o schema.sql'}`,
      };
    }
  }

  // --- ALUNOS (STUDENTS) ---

  static async fetchStudents(): Promise<Student[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) throw error;
      
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        preferredName: row.preferred_name,
        registrationNumber: row.registration_number,
        schoolClass: row.school_class,
        schoolYear: row.school_year,
        avatarUrl: row.avatar_url,
        supportLevel: row.support_level,
        preferences: row.preferences,
        biometrics: row.biometrics,
        consent: row.consent,
        completedActivityIds: row.completed_activity_ids || [],
        inProgressActivityId: row.in_progress_activity_id,
        skillMastery: row.skill_mastery,
        totalStars: row.total_stars || 0,
        peacefulFocusMinutes: row.peaceful_focus_minutes || 0,
        needsPedagogicalSupport: row.needs_pedagogical_support || false,
        supportReason: row.support_reason,
        restrictedClinicalNotes: row.restricted_clinical_notes,
      }));
    } catch (e) {
      console.warn('Supabase fetchStudents falhou, usando armazenamento local:', e);
      return null;
    }
  }

  static async upsertStudent(student: Student): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('students').upsert({
        id: student.id,
        name: student.name,
        preferred_name: student.preferredName,
        registration_number: student.registrationNumber,
        school_class: student.schoolClass,
        school_year: student.schoolYear,
        avatar_url: student.avatarUrl,
        support_level: student.supportLevel,
        preferences: student.preferences,
        biometrics: student.biometrics,
        consent: student.consent,
        completed_activity_ids: student.completedActivityIds,
        in_progress_activity_id: student.inProgressActivityId,
        skill_mastery: student.skillMastery,
        total_stars: student.totalStars,
        peaceful_focus_minutes: student.peacefulFocusMinutes,
        needs_pedagogical_support: student.needsPedagogicalSupport,
        support_reason: student.supportReason,
        restricted_clinical_notes: student.restrictedClinicalNotes,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch (e) {
      console.warn('Supabase upsertStudent falhou:', e);
      return false;
    }
  }

  static async deleteStudent(studentId: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('students').delete().eq('id', studentId);
      return !error;
    } catch (e) {
      console.warn('Supabase deleteStudent falhou:', e);
      return false;
    }
  }

  // --- ATIVIDADES (ACTIVITIES) ---

  static async fetchActivities(): Promise<Activity[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) throw error;

      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        topic: row.topic,
        discipline: row.discipline,
        description: row.description,
        targetSupportLevel: row.target_support_level,
        estimatedMinutes: row.estimated_minutes,
        coverImageUrl: row.cover_image_url,
        steps: row.steps,
        adaptiveAiAssistanceEnabled: row.adaptive_ai_assistance_enabled ?? true,
        createdByTeacherId: row.created_by_teacher_id,
        createdAt: row.created_at || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn('Supabase fetchActivities falhou, usando armazenamento local:', e);
      return null;
    }
  }

  static async upsertActivity(activity: Activity): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('activities').upsert({
        id: activity.id,
        title: activity.title,
        topic: activity.topic,
        discipline: activity.discipline,
        description: activity.description,
        target_support_level: activity.targetSupportLevel,
        estimated_minutes: activity.estimatedMinutes,
        cover_image_url: activity.coverImageUrl,
        steps: activity.steps,
        adaptive_ai_assistance_enabled: activity.adaptiveAiAssistanceEnabled,
        created_by_teacher_id: activity.createdByTeacherId,
      });
      return !error;
    } catch (e) {
      console.warn('Supabase upsertActivity falhou:', e);
      return false;
    }
  }

  // --- LOGS DE AUDITORIA (AUDIT LOGS) ---

  static async fetchAuditLogs(): Promise<AuditLogItem[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error || !data) throw error;

      return data.map((row: any) => ({
        id: row.id,
        timestamp: row.timestamp,
        action: row.action,
        actor: row.actor,
        targetStudentId: row.target_student_id,
        category: row.category,
        details: row.details,
      }));
    } catch (e) {
      console.warn('Supabase fetchAuditLogs falhou:', e);
      return null;
    }
  }

  static async recordAuditLog(log: AuditLogItem): Promise<void> {
    if (!supabase) return;
    try {
      await supabase.from('audit_logs').insert({
        id: log.id,
        timestamp: log.timestamp,
        action: log.action,
        actor: log.actor,
        target_student_id: log.targetStudentId,
        category: log.category,
        details: log.details,
      });
    } catch (e) {
      console.warn('Supabase recordAuditLog falhou:', e);
    }
  }
}
