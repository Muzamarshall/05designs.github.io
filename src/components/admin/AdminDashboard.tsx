"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, CheckCircle, Send, ExternalLink, Edit2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { AnalysisRecord } from "@/types/analysis";

const STATUS_COLOR: Record<string, "default" | "warning" | "success"> = {
  pending: "warning",
  approved: "default",
  sent: "success",
};

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [selected, setSelected] = useState<AnalysisRecord | null>(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchAnalyses = useCallback(async () => {
    const res = await fetch("/api/admin/list", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      const data = await res.json();
      setAnalyses(data.analyses);
    }
  }, [password]);

  useEffect(() => {
    if (authed) fetchAnalyses();
  }, [authed, fetchAnalyses]);

  async function handleLogin() {
    const res = await fetch("/api/admin/list", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  function selectRecord(record: AnalysisRecord) {
    setSelected(record);
    const analysis = JSON.parse(record.analysis_json);
    setEditedMessage(record.follow_up_edited ?? analysis.ownerEmail.followUpMessage);
    setSaved(false);
  }

  async function saveEdits() {
    if (!selected) return;
    setSaving(true);
    await fetch("/api/admin/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ token: selected.approval_token, followUpEdited: editedMessage }),
    });
    setSaving(false);
    setSaved(true);
  }

  async function approve() {
    if (!selected) return;
    setApproving(true);
    await fetch(`/api/approve/${selected.approval_token}`);
    setApproving(false);
    await fetchAnalyses();
    setSelected(null);
  }

  if (!authed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-cyan-400" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button onClick={handleLogin} className="w-full">
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* List panel */}
      <div className="lg:col-span-2">
        <h1 className="mb-4 text-2xl font-bold text-white">
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <div className="space-y-2">
          {analyses.length === 0 && (
            <p className="text-slate-500 text-sm">No analyses yet.</p>
          )}
          {analyses.map((a) => (
            <button
              key={a.id}
              onClick={() => selectRecord(a)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                selected?.id === a.id
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-medium text-white text-sm">{a.company_name}</span>
                <Badge variant={STATUS_COLOR[a.approval_status]}>{a.approval_status}</Badge>
              </div>
              <p className="text-xs text-slate-400">{a.contact_email}</p>
              <p className="text-xs text-slate-600 mt-1">{formatDate(a.created_at)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="lg:col-span-3">
        {!selected ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-slate-800 text-slate-600">
            Select an analysis to review
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">{selected.company_name}</h2>
                <p className="text-sm text-slate-400">{selected.contact_name} — {selected.contact_email}</p>
              </div>
              <a
                href={`/results/${selected.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto"
              >
                <Button variant="ghost" size="sm" className="gap-1">
                  <ExternalLink className="h-3.5 w-3.5" /> View Report
                </Button>
              </a>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Edit2 className="h-4 w-4 text-cyan-400" />
                  Follow-Up Message
                  <span className="ml-auto text-xs text-slate-500 font-normal">
                    Editable before sending
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={editedMessage}
                  onChange={(e) => { setEditedMessage(e.target.value); setSaved(false); }}
                  className="min-h-[200px] font-mono text-xs"
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={saveEdits}
                    disabled={saving}
                    className="gap-1"
                  >
                    {saving ? "Saving..." : saved ? <><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Saved</> : "Save Edits"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={approve}
                    disabled={approving || selected.approval_status === "sent"}
                    className="gap-1 ml-auto"
                  >
                    {approving ? "Sending..." : <><Send className="h-3.5 w-3.5" /> Approve & Send</>}
                  </Button>
                </div>
                {selected.approval_status === "sent" && (
                  <p className="text-sm text-emerald-400">
                    ✓ Follow-up sent on {formatDate(selected.approved_at!)}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
