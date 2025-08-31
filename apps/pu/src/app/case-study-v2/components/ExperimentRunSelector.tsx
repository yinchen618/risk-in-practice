'use client'

import { format } from 'date-fns'
import { BarChart3, Calendar, Loader2, Plus, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import {
  useCreateExperimentRun,
  useDeleteExperimentRun,
  useExperimentRuns,
} from '../hooks/useExperimentRun'
import type { ExperimentRun, FilteringParameters } from '../types'

interface ExperimentRunSelectorProps {
  selectedRunId: string
  onRunSelect: (runId: string) => void
  selectedRun?: ExperimentRun | null
}

export function ExperimentRunSelector({
  selectedRunId,
  onRunSelect,
  selectedRun,
}: ExperimentRunSelectorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newRunName, setNewRunName] = useState('')
  const [newRunDescription, setNewRunDescription] = useState('')

  const { data: experimentRuns, isLoading } = useExperimentRuns()
  const createMutation = useCreateExperimentRun()
  const deleteMutation = useDeleteExperimentRun()

  const handleCreateExperiment = async () => {
    if (!newRunName.trim()) {
      return
    }

    // Default filtering parameters for new experiments
    const defaultFilteringParams: FilteringParameters = {
      power_threshold_min: 0,
      power_threshold_max: 10000,
      spike_detection_threshold: 2.0,
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      end_date: new Date().toISOString(),
      exclude_weekends: false,
      time_window_hours: 24,
      max_missing_ratio: 0.1,
      min_data_points: 100,
      enable_peer_comparison: true,
      peer_deviation_threshold: 1.5,
      buildings: [],
      floors: [],
      rooms: [],
    }

    try {
      const newRun = await createMutation.mutateAsync({
        name: newRunName.trim(),
        description: newRunDescription.trim() || undefined,
        filtering_parameters: defaultFilteringParams,
      })

      // Select the newly created experiment
      onRunSelect(newRun.id)

      // Close dialog and reset form
      setIsCreateDialogOpen(false)
      setNewRunName('')
      setNewRunDescription('')
    } catch (error) {
      console.error('Failed to create experiment run:', error)
    }
  }

  const handleDeleteExperiment = async () => {
    if (!selectedRun) {
      return
    }

    try {
      await deleteMutation.mutateAsync(selectedRun.id)

      // Reset to "new" selection after deletion
      onRunSelect('new')
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete experiment run:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading experiments...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Experiment Selection */}
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <Label htmlFor="experiment-select">Select Experiment Run</Label>
          <Select
            value={selectedRunId === 'new' || !selectedRunId ? '' : selectedRunId}
            onValueChange={onRunSelect}
          >
            <SelectTrigger id="experiment-select">
              <SelectValue placeholder="Please select an experiment run" />
            </SelectTrigger>
            <SelectContent>
              {experimentRuns?.map(run => (
                <SelectItem key={run.id} value={run.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{run.name}</span>
                    <Badge
                      variant={
                        run.status === 'COMPLETED'
                          ? 'default'
                          : run.status === 'LABELING'
                            ? 'secondary'
                            : 'outline'
                      }
                      className="ml-2"
                    >
                      {run.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Management Button */}
        {selectedRun && selectedRunId !== 'new' && (
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-shrink-0 h-10">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Experiment</DialogTitle>
                <DialogDescription>
                  Manage your experiment run and its associated data
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{selectedRun.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedRun.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">{selectedRun.status}</Badge>
                    {selectedRun.candidate_count && (
                      <span>{selectedRun.candidate_count} candidates</span>
                    )}
                  </div>
                </div>

                {deleteMutation.error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Failed to delete experiment: {deleteMutation.error.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="font-medium text-red-900 mb-2">Delete Experiment</h5>
                  <p className="text-sm text-red-700 mb-3">
                    This will permanently delete the experiment and all associated data including:
                  </p>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1 mb-4">
                    <li>All generated candidates (anomaly events)</li>
                    <li>Expert labeling data</li>
                    <li>Trained models and evaluation results</li>
                    <li>All prediction results</li>
                  </ul>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteExperiment}
                    disabled={deleteMutation.isPending}
                    className="w-full"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Experiment & All Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 h-10">
              <Plus className="h-4 w-4" />
              New Experiment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Experiment Run</DialogTitle>
              <DialogDescription>
                Create a new experiment run to begin the PU Learning workflow
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newRunName}
                  onChange={e => setNewRunName(e.target.value)}
                  placeholder="Enter experiment name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newRunDescription}
                  onChange={e => setNewRunDescription(e.target.value)}
                  placeholder="Describe this experiment run"
                  rows={3}
                />
              </div>

              {createMutation.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to create experiment: {createMutation.error.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateExperiment}
                  disabled={!newRunName.trim() || createMutation.isPending}
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Create Experiment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Selected Experiment Details */}
      {selectedRun && selectedRunId !== 'new' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedRun.name}</span>
              <Badge
                variant={
                  selectedRun.status === 'COMPLETED'
                    ? 'default'
                    : selectedRun.status === 'LABELING'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {selectedRun.status}
              </Badge>
            </CardTitle>
            {selectedRun.description && (
              <CardDescription>{selectedRun.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{format(new Date(selectedRun.created_at), 'MMM dd, yyyy')}</span>
              </div>

              {selectedRun.candidate_count !== null && (
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Candidates:</span>
                  <span>{selectedRun.candidate_count}</span>
                </div>
              )}

              {selectedRun.positive_label_count !== null &&
                selectedRun.negative_label_count !== null && (
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Labeled:</span>
                    <span>
                      {(selectedRun.positive_label_count || 0) +
                        (selectedRun.negative_label_count || 0)}{' '}
                      / {selectedRun.candidate_count}
                    </span>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
