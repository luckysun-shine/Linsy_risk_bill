import type { ComplianceEducationData } from '@/types/bill'

/** 合规数读 — 廉洁宣教成果 mock */
export const mockComplianceEducation: ComplianceEducationData = {
  intro:
    '过去一年，我们通过多元化的宣教手段，深耕廉洁合规领域，各项关键指标均实现了提升：',
  items: [
    {
      title: '宣教矩阵全覆盖',
      paragraphs: [
        [
          { text: '发布廉洁发文 ' },
          { text: '13', accent: true },
          { text: ' 篇（含以案示警 ' },
          { text: '2', accent: true },
          { text: ' 篇）、廉洁视频 ' },
          { text: '7', accent: true },
          { text: ' 篇。' },
        ],
        [
          { text: '结合“廉洁月”专项活动，实现 ' },
          { text: '4700', accent: true },
          { text: ' 人次参与阅读，覆盖率达 ' },
          { text: '69%', accent: true },
          { text: '，同比稳步增长 ' },
          { text: '11%', accent: true },
          { text: '。' },
        ],
      ],
    },
    {
      title: '培训效能大提升',
      paragraphs: [
        [
          { text: '举办廉洁主题活动共 ' },
          { text: '17', accent: true },
          { text: ' 场，' },
          { text: '100%', accent: true },
          { text: ' 覆盖关键岗位。' },
        ],
        [
          { text: '参与人次达到 ' },
          { text: '1162', accent: true },
          { text: ' 人次，培训覆盖率同比增长 ' },
          { text: '54%', accent: true },
          { text: '，有效强化了关键岗位的廉洁意识。' },
        ],
      ],
    },
    {
      title: '合规风气显著净化',
      paragraphs: [
        [
          { text: '员工从“被动合规”转向“主动报备”。' },
        ],
        [
          { text: '全年收到廉洁报备 ' },
          { text: '1052', accent: true },
          { text: ' 次，廉洁自律的职场氛围持续向好。' },
        ],
      ],
    },
  ],
}
