'use client'
import { Settings } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUnitOptionsForBuilding } from '@/hooks/use-testbed-data'

interface ExplorerControlsProps {
  selectedBuilding: string
  setSelectedBuilding: (value: string) => void
  selectedUnit: string
  setSelectedUnit: (value: string) => void
  selectedMeter: string
  setSelectedMeter: (value: string) => void
  // Display mode - single unit or floor
  displayMode: 'single' | 'floor'
  setDisplayMode: (mode: 'single' | 'floor') => void
  // Selected floor
  selectedFloor: string
  setSelectedFloor: (floor: string) => void
  // Separate date and time parameters like TimeRangeFilter
  startDate: Date
  setStartDate: (date: Date) => void
  endDate: Date
  setEndDate: (date: Date) => void
  startTime: string
  setStartTime: (time: string) => void
  endTime: string
  setEndTime: (time: string) => void
  rangeMode: '6h' | '12h' | '1d' | '3d' | '1w' | 'custom'
  setRangeMode: (mode: '6h' | '12h' | '1d' | '3d' | '1w' | 'custom') => void
  onLoadData: (
    building: string,
    unit: string,
    meter: string,
    startDate: Date,
    endDate: Date,
    startTime: string,
    endTime: string,
    mode: 'single' | 'floor',
    floor?: string
  ) => void
}

export function ExplorerControls({
  selectedBuilding,
  setSelectedBuilding,
  selectedUnit,
  setSelectedUnit,
  selectedMeter,
  setSelectedMeter,
  displayMode,
  setDisplayMode,
  selectedFloor,
  setSelectedFloor,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  rangeMode,
  setRangeMode,
  onLoadData,
}: ExplorerControlsProps) {
  function computeEndFromStart(
    startDate: Date,
    startTime: string,
    mode: '6h' | '12h' | '1d' | '3d' | '1w'
  ): { date: Date; time: string } {
    // Combine start date and time to get start datetime
    const [hours, minutes] = startTime.split(':').map(Number)
    const startDateTime = new Date(startDate)
    startDateTime.setHours(hours, minutes, 0, 0)

    const msMap: Record<typeof mode, number> = {
      '6h': 6 * 60 * 60 * 1000,
      '12h': 12 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '3d': 3 * 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000,
    } as const

    const endDateTime = new Date(startDateTime.getTime() + msMap[mode])

    return {
      date: new Date(endDateTime.getFullYear(), endDateTime.getMonth(), endDateTime.getDate()),
      time: `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`,
    }
  }
  // Building options
  const buildingOptions = [
    { value: 'a', label: 'Building A' },
    { value: 'b', label: 'Building B' },
  ]

  // Fixed floor options based on building selection
  const getFloorOptionsForBuilding = (building: string) => {
    if (building === 'a') {
      // Building A floors: 1, 2, 3, 5
      return [
        { value: '1', label: 'Floor 1' },
        { value: '2', label: 'Floor 2' },
        { value: '3', label: 'Floor 3' },
        { value: '5', label: 'Floor 5' },
      ]
    }

    // Building B floors: 1, 2, 3, 5, 6
    return [
      { value: '1', label: 'Floor 1' },
      { value: '2', label: 'Floor 2' },
      { value: '3', label: 'Floor 3' },
      { value: '5', label: 'Floor 5' },
      { value: '6', label: 'Floor 6' },
    ]
  }

  // Get current floor options based on selected building
  const floorOptions = getFloorOptionsForBuilding(selectedBuilding || 'a')

  // Get current unit options based on selected building
  const unitOptions = getUnitOptionsForBuilding(selectedBuilding || 'a')

  const selectedUnitHasAppliance =
    unitOptions.find(u => u.value === selectedUnit)?.hasAppliance ?? false

  // If a room without appliance meter is selected in single mode, automatically switch meter type back to main
  useEffect(() => {
    if (
      displayMode === 'single' &&
      !selectedUnitHasAppliance &&
      (selectedMeter === 'appliance' || selectedMeter === 'both')
    ) {
      setSelectedMeter('main')
    }
  }, [displayMode, selectedUnitHasAppliance, selectedMeter, setSelectedMeter])

  const meterOptions = [
    { value: 'both', label: 'Both Meters (Main + Appliance)' },
    { value: 'main', label: 'Main Meter' },
    { value: 'appliance', label: 'Appliance Meter' },
  ]

  // Reset unit selection when building changes
  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value)
    setSelectedUnit('') // Reset unit selection
    setSelectedFloor('') // Reset floor selection when building changes
  }

  // Load data
  const handleLoadData = () => {
    if (displayMode === 'single' && selectedUnit && startDate && startTime) {
      let effectiveEndDate = endDate
      let effectiveEndTime = endTime

      if (rangeMode !== 'custom') {
        const computed = computeEndFromStart(startDate, startTime, rangeMode)
        effectiveEndDate = computed.date
        effectiveEndTime = computed.time
      }

      onLoadData(
        selectedBuilding,
        selectedUnit,
        selectedMeter,
        startDate,
        effectiveEndDate,
        startTime,
        effectiveEndTime,
        'single'
      )
    } else if (displayMode === 'floor' && selectedFloor && startDate && startTime) {
      let effectiveEndDate = endDate
      let effectiveEndTime = endTime

      if (rangeMode !== 'custom') {
        const computed = computeEndFromStart(startDate, startTime, rangeMode)
        effectiveEndDate = computed.date
        effectiveEndTime = computed.time
      }

      onLoadData(
        selectedBuilding,
        '', // No specific unit needed for floor mode
        selectedMeter,
        startDate,
        effectiveEndDate,
        startTime,
        effectiveEndTime,
        'floor',
        selectedFloor
      )
    }
  }

  // Auto-load data when parameters change
  useEffect(() => {
    if (displayMode === 'single' && selectedUnit && selectedMeter && startDate && startTime) {
      handleLoadData()
    } else if (
      displayMode === 'floor' &&
      selectedFloor &&
      selectedMeter &&
      startDate &&
      startTime
    ) {
      handleLoadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedBuilding,
    selectedUnit,
    selectedMeter,
    displayMode,
    selectedFloor,
    startDate,
    endDate,
    startTime,
    endTime,
    rangeMode,
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Smart Meter Data Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Building Selection */}
        <div className="space-y-2">
          <Label htmlFor="building">Building Selection</Label>
          <Select value={selectedBuilding || 'a'} onValueChange={handleBuildingChange}>
            <SelectTrigger id="building">
              <SelectValue placeholder="Choose a building" />
            </SelectTrigger>
            <SelectContent>
              {buildingOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Display Mode Selection */}
        <div className="space-y-2">
          <Label>Display Mode</Label>
          <RadioGroup
            value={displayMode}
            onValueChange={(value: string) => setDisplayMode(value as 'single' | 'floor')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single">Single Unit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="floor" id="floor" />
              <Label htmlFor="floor">Entire Floor</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Floor Selection - only show when displayMode is "floor" */}
        {displayMode === 'floor' && (
          <div className="space-y-2">
            <Label htmlFor="floor-select">Floor Selection</Label>
            <Select
              value={selectedFloor}
              onValueChange={setSelectedFloor}
              disabled={!selectedBuilding}
            >
              <SelectTrigger id="floor-select">
                <SelectValue placeholder="Select a floor" />
              </SelectTrigger>
              <SelectContent>
                {floorOptions.map(floor => (
                  <SelectItem key={floor.value} value={floor.value}>
                    {floor.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Residential Unit Selection - only show when displayMode is "single" */}
        {displayMode === 'single' && (
          <div className="space-y-2">
            <Label htmlFor="unit">Residential Unit</Label>
            <Select
              value={selectedUnit}
              onValueChange={setSelectedUnit}
              disabled={!selectedBuilding}
            >
              <SelectTrigger id="unit">
                <SelectValue placeholder="Choose a unit" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map(room => (
                  <SelectItem key={room.value} value={room.value}>
                    {room.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Meter Type Configuration */}
        <div className="space-y-2">
          <Label htmlFor="meter">Meter Configuration</Label>
          <Select value={selectedMeter} onValueChange={setSelectedMeter}>
            <SelectTrigger id="meter">
              <SelectValue placeholder="Choose meter type" />
            </SelectTrigger>
            <SelectContent>
              {meterOptions.map(option => {
                // Only disable appliance/both options in single mode when unit has no appliance meter
                const disabled =
                  displayMode === 'single' &&
                  (option.value === 'appliance' || option.value === 'both') &&
                  !selectedUnitHasAppliance
                return (
                  <SelectItem key={option.value} value={option.value} disabled={disabled}>
                    {option.label}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Temporal Range Configuration */}
        <div className="space-y-2">
          <Label htmlFor="start-date">Analysis Start Date</Label>
          <input
            id="start-date"
            type="date"
            value={startDate.toISOString().split('T')[0]}
            onChange={e => setStartDate(new Date(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start-time">Analysis Start Time</Label>
          <input
            id="start-time"
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Quick range buttons */}
        <div className="space-y-2">
          <Label>Time Range</Label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: '6h', label: '6hr' },
                { key: '12h', label: '12hr' },
                { key: '1d', label: '1day' },
                { key: '3d', label: '3day' },
                { key: '1w', label: '1week' },
              ] as const
            ).map(({ key, label }) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => {
                  setRangeMode(key)
                  // Auto-compute end date and time
                  const computed = computeEndFromStart(startDate, startTime, key)
                  setEndDate(computed.date)
                  setEndTime(computed.time)
                }}
                className={rangeMode === key ? 'bg-slate-900 text-white' : ''}
              >
                {label}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRangeMode('custom')}
              className={rangeMode === 'custom' ? 'bg-slate-900 text-white' : ''}
            >
              custom
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date">Analysis End Date</Label>
          <input
            id="end-date"
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={e => setEndDate(new Date(e.target.value))}
            disabled={rangeMode !== 'custom'}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-time">Analysis End Time</Label>
          <input
            id="end-time"
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            disabled={rangeMode !== 'custom'}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Load Data Button */}
        {/* <div className="pt-4">
					<Button
						onClick={handleLoadData}
						disabled={!selectedUnit || !startDate || !endDate}
						className="w-full"
					>
						<Search className="mr-2 h-4 w-4" />
						Load Data
					</Button>
				</div> */}
      </CardContent>
    </Card>
  )
}
