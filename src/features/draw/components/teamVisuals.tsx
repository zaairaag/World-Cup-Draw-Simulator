import styled, { css } from 'styled-components';

import type { Confederation } from '../../../types';

const countryCodeMap: Record<string, string> = {
  ARG: 'ar',
  AUS: 'au',
  BEL: 'be',
  BRA: 'br',
  CAN: 'ca',
  CHI: 'cl',
  CMR: 'cm',
  COL: 'co',
  CRC: 'cr',
  CRO: 'hr',
  DEN: 'dk',
  ECU: 'ec',
  ENG: 'gb-eng',
  ESP: 'es',
  FRA: 'fr',
  GER: 'de',
  IRN: 'ir',
  ITA: 'it',
  JPN: 'jp',
  KOR: 'kr',
  KSA: 'sa',
  MAR: 'ma',
  MEX: 'mx',
  NED: 'nl',
  NGA: 'ng',
  POL: 'pl',
  POR: 'pt',
  SEN: 'sn',
  SRB: 'rs',
  SUI: 'ch',
  URU: 'uy',
  USA: 'us'
};

const confederationToneMap: Record<Confederation, { background: string; color: string }> = {
  AFC: {
    background: 'rgba(139, 79, 207, 0.12)',
    color: '#8b4fcf'
  },
  CAF: {
    background: 'rgba(213, 43, 30, 0.12)',
    color: '#d52b1e'
  },
  CONCACAF: {
    background: 'rgba(196, 127, 10, 0.14)',
    color: '#b46c00'
  },
  CONMEBOL: {
    background: 'rgba(0, 169, 80, 0.12)',
    color: '#008f44'
  },
  OFC: {
    background: 'rgba(14, 138, 158, 0.12)',
    color: '#0e8a9e'
  },
  UEFA: {
    background: 'rgba(27, 79, 155, 0.12)',
    color: '#1b4f9b'
  }
};

interface TeamFlagProps {
  code: string;
  teamName: string;
  size?: 'sm' | 'md';
}

interface ConfederationBadgeProps {
  confederation: Confederation;
  size?: 'compact' | 'regular';
}

export function TeamFlag({ code, teamName, size = 'md' }: TeamFlagProps) {
  const countryCode = countryCodeMap[code];

  if (countryCode === undefined) {
    return (
      <FlagFrame $size={size}>
        <FlagFallback>{code}</FlagFallback>
      </FlagFrame>
    );
  }

  return (
    <FlagFrame $size={size}>
      <FlagImage
        src={`https://flagcdn.com/w80/${countryCode}.png`}
        alt={`Bandeira de ${teamName}`}
        loading="lazy"
        decoding="async"
        width={80}
        height={54}
      />
    </FlagFrame>
  );
}

export function ConfederationBadge({ confederation, size = 'regular' }: ConfederationBadgeProps) {
  const tone = confederationToneMap[confederation];

  return (
    <BadgeFrame $background={tone.background} $color={tone.color} $size={size}>
      {confederation}
    </BadgeFrame>
  );
}

const compactFlag = css`
  width: 26px;
  height: 18px;
`;

const regularFlag = css`
  width: 42px;
  height: 28px;
`;

const FlagFrame = styled.span<{ $size: 'sm' | 'md' }>`
  ${({ $size }) => ($size === 'sm' ? compactFlag : regularFlag)}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  box-shadow: inset 0 0 0 1px rgba(26, 28, 28, 0.08);
`;

const FlagImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const FlagFallback = styled.span`
  font-size: 0.54rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.muted};
`;

const BadgeFrame = styled.span<{
  $background: string;
  $color: string;
  $size: 'compact' | 'regular';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $size }) => ($size === 'compact' ? '4px 8px' : '6px 10px')};
  border-radius: 999px;
  background: ${({ $background }) => $background};
  color: ${({ $color }) => $color};
  font-size: ${({ $size }) => ($size === 'compact' ? '0.56rem' : '0.68rem')};
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
`;
