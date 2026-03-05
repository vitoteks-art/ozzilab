import Link from 'next/link'
import { prisma } from '@/lib/db'
import { IntakeDetailClient } from './IntakeDetailClient'

export const dynamic = 'force-dynamic'

export default async function AdminIntakeDetailPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params

  const intake = await prisma.intakeSubmission.findUnique({
    where: { submissionId },
    include: { auditRequest: true, files: { orderBy: { createdAt: 'desc' } } },
  })

  if (!intake) return <div className="p-10 text-slate-600">Not found.</div>

  return (
    <div className="px-6 lg:px-10 py-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link className="hover:text-primary transition-colors" href="/admin">
            Admin
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link className="hover:text-primary transition-colors" href="/admin/intakes">
            Submissions
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 font-medium">{intake.submissionId}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{intake.businessName}</h1>
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Active Intake</span>
            </div>
            <p className="text-slate-500 flex items-center gap-2 flex-wrap">
              <span className="material-symbols-outlined text-sm">person</span>
              Submitted by <span className="text-slate-900 font-semibold">{intake.contactEmail}</span>
              <span className="mx-1">•</span>
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {intake.createdAt.toISOString().slice(0, 10)}
              <span className="mx-1">•</span>
              <span className="text-slate-400 text-xs font-mono">{intake.submissionId}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/admin/intakes/${intake.submissionId}`}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Submission
            </Link>

            <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1">Current Status</span>
              <select
                className="min-w-[200px] h-10 px-3 bg-primary text-white font-bold text-sm rounded-lg border-none focus:ring-2 focus:ring-primary/50 cursor-not-allowed opacity-90"
                value={intake.status}
                disabled
              >
                <option value={intake.status}>{intake.status}</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 ml-1">(Status updates coming next)</span>
            </div>
          </div>
        </div>

        <IntakeDetailClient
          intake={{
            submissionId: intake.submissionId,
            businessName: intake.businessName,
            contactEmail: intake.contactEmail,
            createdAt: intake.createdAt.toISOString(),
            status: intake.status,
            industry: intake.industry,
            requestedBuild: intake.requestedBuild,
            kpiTarget: intake.kpiTarget,
            successDefinition: intake.successDefinition,
            budgetRange: intake.budgetRange,
            toolsStack: intake.toolsStack,
            supportingLinks: intake.supportingLinks,
            auditId: intake.auditRequest.auditId,
            files: intake.files.map((f) => ({ id: f.id, originalName: f.originalName, sizeBytes: f.sizeBytes })),
          }}
        />
      </div>
    </div>
  )
}
