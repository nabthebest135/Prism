export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  location?: string
  description?: string
  type: 'work' | 'casual' | 'formal' | 'sport' | 'social'
}

export class CalendarService {
  async getTodaysEvents(): Promise<CalendarEvent[]> {
    try {
      // Try to access device calendar (requires permissions)
      if ('calendar' in navigator) {
        // This is a proposed API, not widely supported yet
        return await this.getDeviceCalendarEvents()
      }
      
      // Fallback to mock events for demo
      return this.getMockEvents()
    } catch (error) {
      console.error('Calendar access error:', error)
      return this.getMockEvents()
    }
  }

  private async getDeviceCalendarEvents(): Promise<CalendarEvent[]> {
    // This would integrate with device calendar APIs
    // Currently not widely supported in browsers
    return []
  }

  private getMockEvents(): CalendarEvent[] {
    // Return empty array - no mock data
    // Real calendar integration would go here
    return []
  }

  getOutfitSuggestionForEvent(event: CalendarEvent): string {
    switch (event.type) {
      case 'work':
        return 'Business casual - dress shirt, slacks, dress shoes'
      case 'formal':
        return 'Formal attire - suit, dress shirt, tie, dress shoes'
      case 'sport':
        return 'Athletic wear - workout clothes, sneakers'
      case 'social':
        return 'Smart casual - nice top, jeans, comfortable shoes'
      default:
        return 'Comfortable casual wear'
    }
  }

  async requestCalendarPermission(): Promise<boolean> {
    try {
      // Request calendar permission (browser-specific)
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'calendar' as any })
        return result.state === 'granted'
      }
      return false
    } catch (error) {
      console.error('Calendar permission error:', error)
      return false
    }
  }
}