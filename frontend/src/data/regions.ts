// 中国省市区数据（精简版）
export interface Region {
  value: string
  label: string
  children?: Region[]
}

export const regionData: Region[] = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '东城区', label: '东城区' },
          { value: '西城区', label: '西城区' },
          { value: '朝阳区', label: '朝阳区' },
          { value: '丰台区', label: '丰台区' },
          { value: '石景山区', label: '石景山区' },
          { value: '海淀区', label: '海淀区' },
          { value: '门头沟区', label: '门头沟区' },
          { value: '房山区', label: '房山区' },
          { value: '通州区', label: '通州区' },
          { value: '顺义区', label: '顺义区' },
          { value: '昌平区', label: '昌平区' },
          { value: '大兴区', label: '大兴区' },
          { value: '怀柔区', label: '怀柔区' },
          { value: '平谷区', label: '平谷区' },
          { value: '密云区', label: '密云区' },
          { value: '延庆区', label: '延庆区' }
        ]
      }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          { value: '黄浦区', label: '黄浦区' },
          { value: '徐汇区', label: '徐汇区' },
          { value: '长宁区', label: '长宁区' },
          { value: '静安区', label: '静安区' },
          { value: '普陀区', label: '普陀区' },
          { value: '虹口区', label: '虹口区' },
          { value: '杨浦区', label: '杨浦区' },
          { value: '闵行区', label: '闵行区' },
          { value: '宝山区', label: '宝山区' },
          { value: '嘉定区', label: '嘉定区' },
          { value: '浦东新区', label: '浦东新区' },
          { value: '金山区', label: '金山区' },
          { value: '松江区', label: '松江区' },
          { value: '青浦区', label: '青浦区' },
          { value: '奉贤区', label: '奉贤区' },
          { value: '崇明区', label: '崇明区' }
        ]
      }
    ]
  },
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '广州市',
        label: '广州市',
        children: [
          { value: '荔湾区', label: '荔湾区' },
          { value: '越秀区', label: '越秀区' },
          { value: '海珠区', label: '海珠区' },
          { value: '天河区', label: '天河区' },
          { value: '白云区', label: '白云区' },
          { value: '黄埔区', label: '黄埔区' },
          { value: '番禺区', label: '番禺区' },
          { value: '花都区', label: '花都区' },
          { value: '南沙区', label: '南沙区' },
          { value: '从化区', label: '从化区' },
          { value: '增城区', label: '增城区' }
        ]
      },
      {
        value: '深圳市',
        label: '深圳市',
        children: [
          { value: '罗湖区', label: '罗湖区' },
          { value: '福田区', label: '福田区' },
          { value: '南山区', label: '南山区' },
          { value: '宝安区', label: '宝安区' },
          { value: '龙岗区', label: '龙岗区' },
          { value: '盐田区', label: '盐田区' },
          { value: '龙华区', label: '龙华区' },
          { value: '坪山区', label: '坪山区' },
          { value: '光明区', label: '光明区' }
        ]
      },
      {
        value: '东莞市',
        label: '东莞市',
        children: [
          { value: '东城街道', label: '东城街道' },
          { value: '南城街道', label: '南城街道' },
          { value: '万江街道', label: '万江街道' },
          { value: '莞城街道', label: '莞城街道' },
          { value: '石碣镇', label: '石碣镇' },
          { value: '石龙镇', label: '石龙镇' },
          { value: '茶山镇', label: '茶山镇' },
          { value: '石排镇', label: '石排镇' },
          { value: '企石镇', label: '企石镇' },
          { value: '横沥镇', label: '横沥镇' },
          { value: '桥头镇', label: '桥头镇' },
          { value: '谢岗镇', label: '谢岗镇' },
          { value: '东坑镇', label: '东坑镇' },
          { value: '常平镇', label: '常平镇' },
          { value: '寮步镇', label: '寮步镇' },
          { value: '樟木头镇', label: '樟木头镇' },
          { value: '大朗镇', label: '大朗镇' },
          { value: '黄江镇', label: '黄江镇' },
          { value: '清溪镇', label: '清溪镇' },
          { value: '塘厦镇', label: '塘厦镇' },
          { value: '凤岗镇', label: '凤岗镇' },
          { value: '大岭山镇', label: '大岭山镇' },
          { value: '长安镇', label: '长安镇' },
          { value: '虎门镇', label: '虎门镇' },
          { value: '厚街镇', label: '厚街镇' },
          { value: '沙田镇', label: '沙田镇' },
          { value: '道滘镇', label: '道滘镇' },
          { value: '洪梅镇', label: '洪梅镇' },
          { value: '麻涌镇', label: '麻涌镇' },
          { value: '望牛墩镇', label: '望牛墩镇' },
          { value: '中堂镇', label: '中堂镇' },
          { value: '高埗镇', label: '高埗镇' }
        ]
      },
      {
        value: '佛山市',
        label: '佛山市',
        children: [
          { value: '禅城区', label: '禅城区' },
          { value: '南海区', label: '南海区' },
          { value: '顺德区', label: '顺德区' },
          { value: '三水区', label: '三水区' },
          { value: '高明区', label: '高明区' }
        ]
      }
    ]
  },
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      {
        value: '杭州市',
        label: '杭州市',
        children: [
          { value: '上城区', label: '上城区' },
          { value: '拱墅区', label: '拱墅区' },
          { value: '西湖区', label: '西湖区' },
          { value: '滨江区', label: '滨江区' },
          { value: '萧山区', label: '萧山区' },
          { value: '余杭区', label: '余杭区' },
          { value: '临平区', label: '临平区' },
          { value: '钱塘区', label: '钱塘区' },
          { value: '富阳区', label: '富阳区' },
          { value: '临安区', label: '临安区' }
        ]
      },
      {
        value: '宁波市',
        label: '宁波市',
        children: [
          { value: '海曙区', label: '海曙区' },
          { value: '江北区', label: '江北区' },
          { value: '北仑区', label: '北仑区' },
          { value: '镇海区', label: '镇海区' },
          { value: '鄞州区', label: '鄞州区' },
          { value: '奉化区', label: '奉化区' }
        ]
      }
    ]
  },
  {
    value: '江苏省',
    label: '江苏省',
    children: [
      {
        value: '南京市',
        label: '南京市',
        children: [
          { value: '玄武区', label: '玄武区' },
          { value: '秦淮区', label: '秦淮区' },
          { value: '建邺区', label: '建邺区' },
          { value: '鼓楼区', label: '鼓楼区' },
          { value: '浦口区', label: '浦口区' },
          { value: '栖霞区', label: '栖霞区' },
          { value: '雨花台区', label: '雨花台区' },
          { value: '江宁区', label: '江宁区' },
          { value: '六合区', label: '六合区' },
          { value: '溧水区', label: '溧水区' },
          { value: '高淳区', label: '高淳区' }
        ]
      },
      {
        value: '苏州市',
        label: '苏州市',
        children: [
          { value: '姑苏区', label: '姑苏区' },
          { value: '虎丘区', label: '虎丘区' },
          { value: '吴中区', label: '吴中区' },
          { value: '相城区', label: '相城区' },
          { value: '吴江区', label: '吴江区' }
        ]
      }
    ]
  }
]
