"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { CheckSquare, Plus, X } from "lucide-react"
import type { ChecklistItem } from "@/lib/audit-types"

interface AuditChecklistProps {
  items: ChecklistItem[]
  onUpdate: (items: ChecklistItem[]) => void
  readOnly?: boolean
  onItemSelect?: Dispatch<SetStateAction<ChecklistItem | null>>
}

export function AuditChecklist({ items, onUpdate, readOnly = false }: AuditChecklistProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newItem, setNewItem] = useState("")

  const handleToggle = (id: string) => {
    const updated = items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    onUpdate(updated)
  }

  const handleAddItem = () => {
    if (!newItem.trim()) return

    const item: ChecklistItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: newItem,
      description: "",
      completed: false,
      evidence: [],
    }

    onUpdate([...items, item])
    setNewItem("")
  }

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id)
    onUpdate(updated)
  }

  const handleUpdateNote = (id: string, notes: string) => {
    const updated = items.map((item) => (item.id === id ? { ...item, notes } : item))
    onUpdate(updated)
  }

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Lista de Verificación
        </CardTitle>
        <CardDescription>
          Progreso: {completedCount} de {totalCount} ({progress}%)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div className="bg-primary h-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggle(item.id)}
                  disabled={readOnly}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${
                      item.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteItem(item.id)}
                    className="h-6 w-6 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Notes */}
              {!readOnly && (
                <Input
                  placeholder="Notas..."
                  value={item.notes || ""}
                  onChange={(e) => handleUpdateNote(item.id, e.target.value)}
                  className="text-sm"
                />
              )}
              {item.notes && readOnly && <p className="text-sm text-muted-foreground italic">Notas: {item.notes}</p>}

              {/* Evidence Count */}
              {item.evidence.length > 0 && (
                <p className="text-xs text-muted-foreground">{item.evidence.length} archivo(s) adjunto(s)</p>
              )}
            </div>
          ))}
        </div>

        {/* Add New Item */}
        {!readOnly && (
          <div className="flex gap-2">
            <Input
              placeholder="Nueva tarea de auditoría..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
            />
            <Button onClick={handleAddItem} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Añadir
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
