import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Droplets,
  HeartHandshake,
  Moon,
  Sparkles,
  Stethoscope,
  Utensils,
} from 'lucide-react-native';

interface EmotionalSupportCardProps {
  style?: object;
  compact?: boolean;
  unpadded?: boolean;
}

const QUOTE_KEYS = [
  'emotionalSupport:quotes.quote1',
  'emotionalSupport:quotes.quote2',
  'emotionalSupport:quotes.quote3',
  'emotionalSupport:quotes.quote4',
];

export const EmotionalSupportCard: React.FC<EmotionalSupportCardProps> = ({
  style,
  compact = false,
  unpadded = false,
}) => {
  const { t } = useTranslation(['emotionalSupport', 'common']);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // Dynamic non-repeating quote selection on mount
  const selectedQuoteKey = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * QUOTE_KEYS.length);
    return QUOTE_KEYS[randomIndex];
  }, []);

  const horizontalMargin = unpadded ? 0 : 20;
  const horizontalPadding = unpadded ? 0 : 20;

  return (
    <View style={[styles.container, style]}>
      {/* Section Header */}
      {!compact && (
        <View style={[styles.sectionHeader, { paddingHorizontal: horizontalPadding }]}>
          <HeartHandshake size={20} color="#7B61FF" />
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>
              {t('emotionalSupport:sectionTitle')}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {t('emotionalSupport:sectionSubtitle')}
            </Text>
          </View>
        </View>
      )}

      {/* 1. Rotative Anti-Cliché Empathetic Quote */}
      <View style={[styles.quoteCard, { marginHorizontal: horizontalMargin }]}>
        <View style={styles.quoteIconBadge}>
          <Sparkles size={16} color="#7B61FF" />
        </View>
        <Text style={styles.quoteText}>
          "{t(selectedQuoteKey)}"
        </Text>
      </View>

      {/* 2. Flo-Style Clinical Guidelines Accordion */}
      <View style={[styles.accordionCard, { marginHorizontal: horizontalMargin }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsAccordionOpen(!isAccordionOpen)}
          style={styles.accordionHeader}
        >
          <View style={styles.accordionTitleContainer}>
            <Text style={styles.accordionTitle}>
              {t('emotionalSupport:guidelinesAccordion.title')}
            </Text>
            <Text style={styles.accordionSubtitle}>
              {t('emotionalSupport:guidelinesAccordion.subtitle')}
            </Text>
          </View>
          <View style={styles.accordionChevronWrapper}>
            {isAccordionOpen ? (
              <ChevronUp size={20} color="#7B61FF" />
            ) : (
              <ChevronDown size={20} color="#64748B" />
            )}
          </View>
        </TouchableOpacity>

        {isAccordionOpen && (
          <View style={styles.accordionBody}>
            {/* Hydration */}
            <View style={styles.guideItem}>
              <View style={[styles.guideIconPill, { backgroundColor: '#EFF6FF' }]}>
                <Droplets size={16} color="#3B82F6" />
              </View>
              <View style={styles.guideTextContent}>
                <Text style={styles.guideItemTitle}>
                  {t('emotionalSupport:guidelinesAccordion.hydrationTitle')}
                </Text>
                <Text style={styles.guideItemDesc}>
                  {t('emotionalSupport:guidelinesAccordion.hydrationDesc')}
                </Text>
              </View>
            </View>

            {/* Food */}
            <View style={styles.guideItem}>
              <View style={[styles.guideIconPill, { backgroundColor: '#ECFDF5' }]}>
                <Utensils size={16} color="#10B981" />
              </View>
              <View style={styles.guideTextContent}>
                <Text style={styles.guideItemTitle}>
                  {t('emotionalSupport:guidelinesAccordion.foodTitle')}
                </Text>
                <Text style={styles.guideItemDesc}>
                  {t('emotionalSupport:guidelinesAccordion.foodDesc')}
                </Text>
              </View>
            </View>

            {/* Rest & Breathing */}
            <View style={styles.guideItem}>
              <View style={[styles.guideIconPill, { backgroundColor: '#F3E8FF' }]}>
                <Moon size={16} color="#8B5CF6" />
              </View>
              <View style={styles.guideTextContent}>
                <Text style={styles.guideItemTitle}>
                  {t('emotionalSupport:guidelinesAccordion.restTitle')}
                </Text>
                <Text style={styles.guideItemDesc}>
                  {t('emotionalSupport:guidelinesAccordion.restDesc')}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 3. Multidisciplinary Support Cards (Gastro & Psychology) */}
      <View style={[styles.multiSupportContainer, { paddingHorizontal: horizontalPadding }]}>
        {/* Gastro Card */}
        <View style={[styles.proCard, styles.gastroCard]}>
          <View style={styles.proCardHeader}>
            <View style={[styles.proIconCircle, { backgroundColor: '#EDE9FE' }]}>
              <Stethoscope size={18} color="#7B61FF" />
            </View>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>
                {t('emotionalSupport:gastroCard.tag')}
              </Text>
            </View>
          </View>
          <Text style={styles.proCardTitle}>
            {t('emotionalSupport:gastroCard.title')}
          </Text>
          <Text style={styles.proCardDesc}>
            {t('emotionalSupport:gastroCard.desc')}
          </Text>
        </View>

        {/* Psychology Card */}
        <View style={[styles.proCard, styles.psychoCard]}>
          <View style={styles.proCardHeader}>
            <View style={[styles.proIconCircle, { backgroundColor: '#FCE7F3' }]}>
              <Brain size={18} color="#EC4899" />
            </View>
            <View style={[styles.proBadge, { backgroundColor: '#FDF2F8' }]}>
              <Text style={[styles.proBadgeText, { color: '#DB2777' }]}>
                {t('emotionalSupport:psychoCard.tag')}
              </Text>
            </View>
          </View>
          <Text style={styles.proCardTitle}>
            {t('emotionalSupport:psychoCard.title')}
          </Text>
          <Text style={styles.proCardDesc}>
            {t('emotionalSupport:psychoCard.desc')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  quoteCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9D8FD',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  quoteIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#4C1D95',
    lineHeight: 20,
    flex: 1,
    fontWeight: '500',
  },
  accordionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accordionTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  accordionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  accordionChevronWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8F9FE',
    borderRadius: 14,
    padding: 12,
  },
  guideIconPill: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  guideTextContent: {
    flex: 1,
  },
  guideItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  guideItemDesc: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  multiSupportContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  proCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  gastroCard: {
    backgroundColor: '#FBFBFF',
    borderColor: '#E0E7FF',
  },
  psychoCard: {
    backgroundColor: '#FFFDFE',
    borderColor: '#FCE7F3',
  },
  proCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  proIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  proCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  proCardDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
});
