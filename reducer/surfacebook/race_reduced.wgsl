struct data_index_pair {
	index: i32,
	data: u32,
}

@group(0)
@binding(0)
var<storage, read_write> mem: array<u32>;

@group(0)
@binding(1)
var<storage, read_write> uninit_vars: array<i32>;

@group(0)
@binding(2)
var<storage, read_write> index_buf: array<i32>;

@group(0)
@binding(3)
var<storage, read_write> data_buf: array<u32>;

@group(0)
@binding(4)
var<storage, read_write> output_buf: array<data_index_pair>;

@group(0)
@binding(5)
var<storage, read_write> debug: array<u32>;

var<workgroup> workgroup_buf: array<u32, 256>;

@compute
@workgroup_size(9)
fn main(@builtin(num_workgroups) num_workgroups: vec3<u32>, @builtin(global_invocation_id) global_invocation_id: vec3<u32>, @builtin(local_invocation_id) local_invocation_id: vec3<u32>) {
	var local_data: array<u32, 8>;
	let total_ids = num_workgroups.x * 9u;
	let pattern_index = global_invocation_id.x * 1u;
	var var_1: u32 = 2u;
	var var_3: u32 = 2u;
	var var_6: u32 = 2u;
	var var_9: u32 = 2u;
	var var_11: u32 = 2u;
	var var_13: u32 = 2u;
	var var_15: u32 = 2u;
	var var_18: u32 = 2u;
	var var_19: u32 = 2u;
	var var_20: u32 = 2u;
	var var_21: u32 = 2u;
	var var_22: u32 = 2u;
	var var_23: u32 = 2u;
	var var_24: u32 = 2u;
	var var_26: u32 = 2u;
	var var_27: u32 = 2u;
	var var_28: u32 = 2u;
	var var_31: u32 = 2u;
	var var_32: u32 = 2u;
	var var_33: u32 = 2u;
	var var_34: u32 = 2u;
	var var_35: u32 = 2u;
	var var_39: u32 = 2u;
	var var_40: u32 = 2u;
	var var_41: u32 = 2u;
	var var_42: u32 = 2u;
	var var_43: u32 = 2u;
	var var_44: u32 = 2u;
	var var_46: u32 = 2u;
	var var_48: u32 = 2u;
	var var_52: u32 = 2u;
	var var_54: u32 = 2u;
	var var_58: u32 = 2u;
	var var_59: u32 = 2u;
	var var_60: u32 = 2u;
	var var_61: u32 = 2u;
	var var_62: u32 = 2u;
	var var_63: u32 = 2u;
	var var_64: u32 = 2u;
	var var_67: u32 = 2u;
	var var_68: u32 = 2u;
	var var_69: u32 = 2u;
	var var_70: u32 = 2u;
	var var_71: u32 = 2u;
	var var_73: u32 = 2u;
	var var_74: u32 = 2u;
	var var_76: u32 = 2u;
	var var_78: u32 = 2u;
	var var_80: u32 = 2u;
	var var_83: u32 = 2u;
	var var_87: u32 = 2u;
	var var_88: u32 = 2u;
	var var_91: u32 = 2u;
	var var_96: u32 = 2u;
	var var_99: u32 = 2u;
	var var_100: u32 = 2u;
	var var_101: u32 = 2u;
	var var_104: u32 = 2u;
	var var_105: u32 = 2u;
	var var_106: u32 = 2u;
	var var_107: u32 = 2u;
	var var_108: u32 = 2u;
	var var_113: u32 = 2u;
	var var_115: u32 = 2u;
	var var_118: u32 = 2u;
	var var_119: u32 = 2u;
	var var_121: u32 = 2u;
	var var_123: u32 = 2u;
	var var_124: u32 = 2u;
	var var_127: u32 = 2u;
	var var_128: u32 = 2u;
	var var_130: u32 = 2u;
	var var_131: u32 = 2u;
	var var_132: u32 = 2u;
	var var_134: u32 = 2u;
	var var_136: u32 = 2u;
	var var_139: u32 = 2u;
	var var_140: u32 = 2u;
	var var_142: u32 = 2u;
	var var_144: u32 = 2u;
	var var_145: u32 = 2u;
	var var_146: u32 = 2u;
	var var_150: u32 = 2u;
	var var_151: u32 = 2u;
	var var_152: u32 = 2u;
	var var_154: u32 = 2u;
	var var_155: u32 = 2u;
	var var_159: u32 = 2u;
	var var_160: u32 = 2u;
	var var_161: u32 = 2u;
	var var_163: u32 = 2u;
	var var_164: u32 = 2u;
	var var_165: u32 = 2u;
	var var_170: u32 = 2u;
	var var_171: u32 = 2u;
	var var_173: u32 = 2u;
	var var_175: u32 = 2u;
	var var_176: u32 = 2u;
	var var_177: u32 = 2u;
	var var_178: u32 = 2u;
	var var_179: u32 = 2u;
	var var_180: u32 = 2u;
	var var_181: u32 = 2u;
	var var_182: u32 = 2u;
	var var_183: u32 = 2u;
	var var_184: u32 = 2u;
	var var_185: u32 = 2u;
	var var_186: u32 = 2u;
	var var_188: u32 = 2u;
	var var_189: u32 = 2u;
	var var_190: u32 = 2u;
	var var_192: u32 = 2u;
	var var_193: u32 = 2u;
	var var_194: u32 = 2u;
	var var_195: u32 = 2u;
	var var_197: u32 = 2u;
	var var_198: u32 = 2u;
	var var_199: u32 = 2u;
	var var_200: u32 = 2u;
	var var_204: u32 = 2u;
	var var_205: u32 = 2u;
	var var_212: u32 = 2u;
	var var_213: u32 = 2u;
	var var_215: u32 = 2u;
	var var_216: u32 = 2u;
	var var_217: u32 = 2u;
	var var_218: u32 = 2u;
	var var_221: u32 = 2u;
	var var_223: u32 = 2u;
	var var_224: u32 = 2u;
	var var_225: u32 = 2u;
	var var_227: u32 = 2u;
	var var_228: u32 = 2u;
	var var_229: u32 = 2u;
	var var_230: u32 = 2u;
	var var_234: u32 = 2u;
	var var_235: u32 = 2u;
	var var_236: u32 = 2u;
	var var_240: u32 = 2u;
	var var_241: u32 = 2u;
	var var_242: u32 = 2u;
	var var_244: u32 = 2u;
	var var_246: u32 = 2u;
	var var_250: u32 = 2u;
	var var_251: u32 = 2u;
	var var_252: u32 = 2u;
	var var_253: u32 = 2u;
	var var_254: u32 = 2u;
	var var_255: u32 = 2u;
	var var_258: u32 = 2u;
	var var_262: u32 = 2u;
	var var_263: u32 = 2u;
	var var_265: u32 = 2u;
	var var_267: u32 = 2u;
	var var_268: u32 = 2u;
	var var_270: u32 = 2u;
	var var_271: u32 = 2u;
	var var_272: u32 = 2u;
	var var_0: u32 = 2u;
	var var_2: u32 = 2u;
	var var_4: u32 = 2u;
	var var_5: u32 = 2u;
	var var_7: u32 = 2u;
	var var_8: u32 = 2u;
	var var_10: u32 = 2u;
	var var_12: u32 = 2u;
	var var_14: u32 = 2u;
	var var_16: u32 = 2u;
	var var_17: u32 = 2u;
	var var_25: u32 = 2u;
	var var_29: u32 = 2u;
	var var_30: u32 = 2u;
	var var_36: u32 = 2u;
	var var_37: u32 = 2u;
	var var_38: u32 = 2u;
	var var_45: u32 = 2u;
	var var_47: u32 = 2u;
	var var_49: u32 = 2u;
	var var_50: u32 = 2u;
	var var_51: u32 = 2u;
	var var_53: u32 = 2u;
	var var_55: u32 = 2u;
	var var_56: u32 = 2u;
	var var_57: u32 = 2u;
	var var_65: u32 = 2u;
	var var_66: u32 = 2u;
	var var_72: u32 = 2u;
	var var_75: u32 = 2u;
	var var_77: u32 = 2u;
	var var_79: u32 = 2u;
	var var_81: u32 = 2u;
	var var_82: u32 = 2u;
	var var_84: u32 = 2u;
	var var_85: u32 = 2u;
	var var_86: u32 = 2u;
	var var_89: u32 = 2u;
	var var_90: u32 = 2u;
	var var_92: u32 = 2u;
	var var_93: u32 = 2u;
	var var_94: u32 = 2u;
	var var_95: u32 = 2u;
	var var_97: u32 = 2u;
	var var_98: u32 = 2u;
	var var_102: u32 = 2u;
	var var_103: u32 = 2u;
	var var_109: u32 = 2u;
	var var_110: u32 = 2u;
	var var_111: u32 = 2u;
	var var_112: u32 = 2u;
	var var_114: u32 = 2u;
	var var_116: u32 = 2u;
	var var_117: u32 = 2u;
	var var_120: u32 = 2u;
	var var_122: u32 = 2u;
	var var_125: u32 = 2u;
	var var_126: u32 = 2u;
	var var_129: u32 = 2u;
	var var_133: u32 = 2u;
	var var_135: u32 = 2u;
	var var_137: u32 = 2u;
	var var_138: u32 = 2u;
	var var_141: u32 = 2u;
	var var_143: u32 = 2u;
	var var_147: u32 = 2u;
	var var_148: u32 = 2u;
	var var_149: u32 = 2u;
	var var_153: u32 = 2u;
	var var_156: u32 = 2u;
	var var_157: u32 = 2u;
	var var_158: u32 = 2u;
	var var_162: u32 = 2u;
	var var_166: u32 = 2u;
	var var_167: u32 = 2u;
	var var_168: u32 = 2u;
	var var_169: u32 = 2u;
	var var_172: u32 = 2u;
	var var_174: u32 = 2u;
	var var_187: u32 = 2u;
	var var_191: u32 = 2u;
	var var_196: u32 = 2u;
	var var_201: u32 = 2u;
	var var_202: u32 = 2u;
	var var_203: u32 = 2u;
	var var_206: u32 = 2u;
	var var_207: u32 = 2u;
	var var_208: u32 = 2u;
	var var_209: u32 = 2u;
	var var_210: u32 = 2u;
	var var_211: u32 = 2u;
	var var_214: u32 = 2u;
	var var_219: u32 = 2u;
	var var_220: u32 = 2u;
	var var_222: u32 = 2u;
	var var_226: u32 = 2u;
	var var_231: u32 = 2u;
	var var_232: u32 = 2u;
	var var_233: u32 = 2u;
	var var_237: u32 = 2u;
	var var_238: u32 = 2u;
	var var_239: u32 = 2u;
	var var_243: u32 = 2u;
	var var_245: u32 = 2u;
	var var_247: u32 = 2u;
	var var_248: u32 = 2u;
	var var_249: u32 = 2u;
	var var_256: u32 = 2u;
	var var_257: u32 = 2u;
	var var_259: u32 = 2u;
	var var_260: u32 = 2u;
	var var_261: u32 = 2u;
	var var_264: u32 = 2u;
	var var_266: u32 = 2u;
	var var_269: u32 = 2u;
	var uninit_var_0: i32;
	var uninit_var_1: i32;
	var uninit_var_2: i32;
	var uninit_var_3: i32;
	var uninit_var_4: i32;
	(uninit_vars)[(global_invocation_id.x * 5u) + 0u] = uninit_var_0;
	(uninit_vars)[(global_invocation_id.x * 5u) + 1u] = uninit_var_1;
	(uninit_vars)[(global_invocation_id.x * 5u) + 2u] = uninit_var_2;
	(uninit_vars)[(global_invocation_id.x * 5u) + 3u] = uninit_var_3;
	(uninit_vars)[(global_invocation_id.x * 5u) + 4u] = uninit_var_4;
	if (local_invocation_id.x < 2u) {
    (workgroup_buf)[0u] = 0u;
}
	
	
	
	
	var_150 = ((((((mem[(global_invocation_id.x * 9u) + 8u] + 24u) + var_197) + var_198) + var_199) + var_200) + var_204) + var_205;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var_202 = ((((((((((((var_12 + var_62) + var_63) + var_64) + var_14) + var_16) + var_67) + var_68) + var_17) + var_25) + var_69) + var_70) + var_71) + var_73;
	(mem)[(((global_invocation_id.x + 922u) % total_ids) * 9u) + 5u] = ((((var_29 + var_74) + var_30) + var_76) + var_36) + var_37;
	for (var i_1: u32 = min(var_38, 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    var_153 = ((((((((var_45 + var_78) + var_47) + var_80) + var_49) + var_50) + var_51) + var_83) + var_87) + var_88;
    for (var i_2: u32 = min(var_91, 10u); i_2 > 0u; i_2 = i_2 - 1u) {
        var_135 = var_53 + var_96;
        for (var i_3: u32 = min(var_55, 10u); i_3 > 0u; i_3 = i_3 - 1u) {
            (mem)[(((global_invocation_id.x + 357u) % total_ids) * 9u) + 6u] = (((((((((var_56 + var_99) + var_100) + var_57) + var_101) + var_104) + var_65) + var_66) + var_72) + var_75) + var_77;
            (mem)[(((global_invocation_id.x + 712u) % total_ids) * 9u) + 2u] = (((((((var_79 + mem[(global_invocation_id.x * 9u) + 1u]) + var_105) + var_106) + var_107) + var_81) + var_108) + var_113) + var_82;
            var_117 = ((((((((((((((mem[(((global_invocation_id.x + 623u) % total_ids) * 9u) + 4u] + var_84) + var_85) + var_115) + var_86) + var_89) + var_90) + var_118) + var_92) + var_93) + var_119) + var_121) + var_94) + var_95) + var_97) + var_98;
            var_114 = ((((((((((((var_102 + mem[(global_invocation_id.x * 9u) + 8u]) + var_123) + var_124) + var_103) + var_109) + var_127) + var_110) + var_128) + var_130) + var_111) + var_131) + var_112) + var_132;
            (mem)[(((global_invocation_id.x + 241u) % total_ids) * 9u) + 6u] = ((((((((((((((((18u + var_114) + var_134) + var_136) + var_116) + var_117) + var_120) + var_139) + var_122) + var_140) + var_142) + var_125) + var_126) + var_144) + var_129) + var_133) + var_135) + var_137;
            var_153 = (((((((var_138 + var_145) + var_146) + var_141) + var_143) + var_147) + var_150) + var_148) + var_151;
            var_135 = (8u + mem[(((global_invocation_id.x + 38u) % total_ids) * 9u) + 1u]) + var_149;
            var_157 = ((((((((((((((((((var_152 + var_153) + var_154) + var_156) + var_155) + var_157) + var_159) + var_158) + var_160) + var_161) + var_163) + var_164) + var_162) + var_165) + var_170) + var_171) + var_173) + var_166) + var_167) + var_175;
            var_82 = ((((4u + var_176) + var_168) + var_177) + var_178) + var_179;
            var_12 = mem[0u] + var_180;
            var_111 = (((((10u + var_181) + var_169) + var_182) + var_183) + var_172) + var_174;
            (mem)[(global_invocation_id.x * 9u) + 1u] = (((((((((((((((((((20u + mem[(((global_invocation_id.x + 84u) % total_ids) * 9u) + 5u]) + var_187) + var_184) + var_191) + var_196) + var_201) + var_185) + var_186) + var_202) + var_203) + var_188) + var_189) + var_206) + var_207) + var_190) + var_192) + var_208) + var_193) + var_209) + var_210;
            (mem)[(((global_invocation_id.x + 848u) % total_ids) * 9u) + 1u] = (((((((((((((var_194 + var_195) + var_211) + var_197) + var_214) + var_219) + var_220) + var_198) + var_199) + var_222) + var_200) + var_204) + var_205) + var_212) + var_226;
            var_65 = ((var_231 + 0u) + var_232) + var_213;
            var_269 = ((((((((((((((((((((var_233 + 18u) + mem[(global_invocation_id.x * 9u) + 6u]) + var_237) + var_238) + var_215) + var_239) + var_216) + var_243) + var_245) + var_247) + var_248) + var_249) + var_256) + var_257) + var_259) + var_217) + var_218) + var_221) + var_260) + var_223) + var_224;
            (mem)[(((global_invocation_id.x + 613u) % total_ids) * 9u) + 7u] = (((((((((((((((mem[0u] + var_225) + var_261) + var_264) + var_266) + var_269) + var_227) + var_228) + var_0) + var_2) + var_229) + var_4) + var_5) + var_230) + var_234) + var_235) + var_7;
            (mem)[(global_invocation_id.x * 9u) + 5u] = (((mem[(global_invocation_id.x * 9u) + 4u] + var_8) + var_10) + var_236) + var_240;
            (mem)[(((global_invocation_id.x + 120u) % total_ids) * 9u) + 1u] = ((((((((((((((((var_241 + 20u) + mem[(global_invocation_id.x * 9u) + 3u]) + var_12) + var_242) + var_244) + var_14) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_16) + var_17) + var_255) + var_25) + var_258;
        }
    }
    (mem)[(((global_invocation_id.x + 870u) % total_ids) * 9u) + 5u] = (((mem[(((global_invocation_id.x + 933u) % total_ids) * 9u) + 5u] + mem[(global_invocation_id.x * 9u) + 7u]) + var_262) + var_263) + var_29;
    var_148 = ((((mem[(global_invocation_id.x * 9u) + 7u] + var_265) + var_267) + var_268) + var_270) + var_30;
    for (var i_2: u32 = min(var_271, 10u); i_2 > 0u; i_2 = i_2 - 1u) {
        var_17 = ((((((((((((((var_272 + var_36) + var_1) + var_3) + var_6) + var_9) + var_37) + var_11) + var_13) + var_15) + var_38) + var_45) + var_18) + var_47) + var_49) + var_50;
        var_147 = (((((((mem[(global_invocation_id.x * 9u) + 4u] + var_19) + var_51) + var_20) + var_53) + var_55) + var_21) + var_22) + var_23;
        var_162 = ((((((((((var_56 + var_57) + var_24) + var_65) + var_26) + var_27) + var_66) + var_72) + var_28) + var_75) + var_77) + var_31;
        var_256 = ((((((mem[(((global_invocation_id.x + 247u) % total_ids) * 9u) + 9u] + var_32) + var_33) + var_79) + var_81) + var_34) + var_35) + var_39;
        (mem)[(((global_invocation_id.x + 496u) % total_ids) * 9u) + 7u] = (((var_40 + var_41) + var_42) + var_43) + var_82;
        var_126 = ((((((((mem[(global_invocation_id.x * 9u) + 1u] + var_84) + var_44) + var_46) + var_85) + var_48) + var_86) + var_89) + var_90) + var_52;
        (mem)[(global_invocation_id.x * 9u) + 7u] = ((((((((((((((((((mem[(global_invocation_id.x * 9u) + 1u] + mem[(((global_invocation_id.x + 390u) % total_ids) * 9u) + 1u]) + mem[0u]) + var_92) + var_93) + var_54) + var_94) + var_58) + var_59) + var_95) + var_60) + var_61) + var_62) + var_97) + var_98) + var_102) + var_63) + var_103) + var_64) + var_67;
        var_57 = ((((mem[(global_invocation_id.x * 9u) + 4u] + var_68) + var_69) + var_109) + var_110) + var_70;
        for (var i_3: u32 = min(var_71, 10u); i_3 > 0u; i_3 = i_3 - 1u) {
            var_166 = ((((((((((var_73 + 4u) + var_74) + var_76) + var_78) + var_80) + var_111) + var_83) + var_87) + var_88) + var_112) + var_114;
            var_16 = (((((((((((((((((22u + mem[(global_invocation_id.x * 9u) + 5u]) + var_91) + var_116) + var_96) + var_99) + var_100) + var_117) + var_120) + var_101) + var_122) + var_125) + var_104) + var_126) + var_129) + var_105) + var_133) + var_135) + var_137;
            (mem)[(((global_invocation_id.x + 44u) % total_ids) * 9u) + 1u] = ((((mem[(global_invocation_id.x * 9u) + 5u] + 22u) + var_106) + var_107) + var_108) + var_138;
            var_169 = ((((((((((((mem[(global_invocation_id.x * 9u) + 1u] + mem[(global_invocation_id.x * 9u) + 7u]) + var_113) + var_141) + var_143) + var_147) + var_115) + var_148) + var_149) + var_118) + var_153) + var_119) + var_156) + var_157;
            var_129 = (((((((((((((((var_121 + var_123) + var_158) + var_162) + var_124) + var_166) + var_167) + var_168) + var_169) + var_127) + var_128) + var_172) + var_130) + var_174) + var_131) + var_187) + var_132;
            var_187 = ((((((((((((((((((mem[0u] + mem[(global_invocation_id.x * 9u) + 7u]) + var_134) + var_191) + var_196) + var_136) + var_139) + var_140) + var_201) + var_142) + var_202) + var_144) + var_203) + var_145) + var_146) + var_150) + var_206) + var_151) + var_207) + var_208;
            var_85 = mem[0u] + mem[(global_invocation_id.x * 9u) + 3u];
            var_167 = var_209 + 14u;
        }
    }
}
	var_260 = (((((((((((((var_210 + var_152) + var_154) + var_155) + var_159) + var_160) + var_161) + var_211) + var_163) + var_214) + var_219) + var_164) + var_220) + var_222) + var_165;
	(mem)[(((global_invocation_id.x + 905u) % total_ids) * 9u) + 5u] = ((((((((((((((mem[0u] + mem[(global_invocation_id.x * 9u) + 3u]) + var_170) + var_171) + var_226) + var_173) + var_231) + var_175) + var_176) + var_232) + var_177) + var_233) + var_178) + var_237) + var_179) + var_180;
	var_232 = mem[(global_invocation_id.x * 9u) + 8u];
	(mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((mem[(global_invocation_id.x * 9u) + 3u] + var_181) + var_182) + var_183) + var_184) + var_185) + var_186) + var_188) + var_189) + var_190;
	var_115 = (((((((mem[0u] + mem[0u]) + var_192) + var_193) + var_194) + var_195) + var_197) + var_198) + var_199;
	for (var i_1: u32 = min(var_200, 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    (mem)[(((global_invocation_id.x + 275u) % total_ids) * 9u) + 5u] = ((mem[(global_invocation_id.x * 9u) + 3u] + var_238) + var_239) + var_204;
    var_235 = ((((((((((((((((22u + var_205) + var_212) + var_213) + var_215) + var_216) + var_217) + var_218) + var_221) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235;
    for (var i_2: u32 = min(mem[(global_invocation_id.x * 9u) + 9u], 10u); i_2 > 0u; i_2 = i_2 - 1u) {
        if (var_243 < var_236) {
            var_220 = ((((((((((mem[(global_invocation_id.x * 9u) + 8u] + var_245) + var_240) + var_241) + var_242) + var_247) + var_244) + var_246) + var_248) + var_249) + var_250) + var_251;
            var_133 = ((((((((((((((((((22u + var_252) + var_253) + var_254) + var_256) + var_257) + var_255) + var_258) + var_259) + var_260) + var_262) + var_261) + var_264) + var_263) + var_265) + var_267) + var_268) + var_270) + var_271) + var_266;
            (mem)[(((global_invocation_id.x + 367u) % total_ids) * 9u) + 6u] = ((((((((((mem[0u] + var_269) + var_0) + var_2) + var_4) + var_272) + var_1) + var_3) + var_6) + var_9) + var_11) + var_5;
            var_45 = (((((((((((((var_13 + var_15) + var_7) + var_8) + var_18) + var_10) + var_19) + var_12) + var_20) + var_14) + var_21) + var_22) + var_16) + var_23) + var_24;
            var_30 = ((((((((((mem[(((global_invocation_id.x + 660u) % total_ids) * 9u) + 1u] + mem[(global_invocation_id.x * 9u) + 2u]) + var_17) + var_26) + var_27) + var_25) + var_28) + var_29) + var_30) + var_36) + var_31) + var_37;
            var_112 = mem[0u];
            (mem)[(((global_invocation_id.x + 425u) % total_ids) * 9u) + 2u] = (((4u + var_32) + var_38) + var_45) + var_33;
            var_14 = (((((((((var_34 + var_47) + var_35) + var_39) + var_49) + var_50) + var_51) + var_40) + var_41) + var_42) + var_43;
            (mem)[(global_invocation_id.x * 9u) + 9u] = (((((((((((mem[(global_invocation_id.x * 9u) + 8u] + mem[(global_invocation_id.x * 9u) + 7u]) + var_44) + var_46) + var_53) + var_48) + var_55) + var_56) + var_57) + var_65) + var_66) + var_52) + var_54;
            (mem)[(global_invocation_id.x * 9u) + 4u] = ((((((((mem[0u] + mem[(global_invocation_id.x * 9u) + 3u]) + var_72) + var_75) + var_58) + var_59) + var_60) + var_61) + var_62) + var_63;
            (mem)[(global_invocation_id.x * 9u) + 7u] = (((((((((((((((((var_77 + 8u) + var_64) + var_67) + var_68) + var_79) + var_69) + var_81) + var_82) + var_84) + var_70) + var_71) + var_73) + var_74) + var_76) + var_78) + var_80) + var_85) + var_86;
            var_260 = (((((((var_83 + var_87) + var_88) + var_91) + var_96) + var_99) + var_100) + var_101) + var_104;
            var_12 = (((((((var_89 + var_105) + var_90) + var_106) + var_92) + var_93) + var_107) + var_108) + var_113;
            var_25 = ((((((((((var_94 + var_95) + var_97) + var_98) + var_115) + var_118) + var_102) + var_119) + var_103) + var_121) + var_123) + var_109;
            var_117 = (((((((((((((((((var_110 + var_124) + var_111) + var_127) + var_128) + var_130) + var_112) + var_114) + var_131) + var_116) + var_132) + var_134) + var_117) + var_120) + var_122) + var_136) + var_125) + var_139) + var_140;
            (mem)[(((global_invocation_id.x + 843u) % total_ids) * 9u) + 4u] = ((((((var_142 + var_126) + var_129) + var_133) + var_144) + var_135) + var_145) + var_146;
            (mem)[(((global_invocation_id.x + 656u) % total_ids) * 9u) + 2u] = ((((((((((((mem[(((global_invocation_id.x + 638u) % total_ids) * 9u) + 4u] + var_137) + var_138) + var_150) + var_141) + var_143) + var_151) + var_152) + var_154) + var_155) + var_147) + var_148) + var_149) + var_159;
            var_0 = (((((((var_160 + mem[(global_invocation_id.x * 9u) + 3u]) + var_153) + var_161) + var_163) + var_164) + var_165) + var_156) + var_170;
            (mem)[(global_invocation_id.x * 9u) + 9u] = (((mem[(((global_invocation_id.x + 799u) % total_ids) * 9u) + 1u] + var_171) + var_157) + var_158) + var_173;
            var_269 = ((((0u + var_175) + var_176) + var_177) + var_178) + var_162;
            (mem)[(((global_invocation_id.x + 497u) % total_ids) * 9u) + 7u] = ((((((((((((mem[0u] + 18u) + var_179) + var_180) + var_181) + var_166) + var_182) + var_167) + var_183) + var_168) + var_169) + var_184) + var_172) + var_185;
            var_211 = (((((((((((((mem[0u] + 10u) + var_186) + var_188) + var_174) + var_187) + var_191) + var_196) + var_189) + var_190) + var_201) + var_202) + var_192) + var_193) + var_194;
            (mem)[(((global_invocation_id.x + 21u) % total_ids) * 9u) + 7u] = (((((((((((((((((var_195 + mem[0u]) + var_203) + var_206) + var_207) + var_197) + var_208) + var_209) + var_210) + var_211) + var_214) + var_198) + var_219) + var_220) + var_199) + var_200) + var_222) + var_204) + var_205;
            var_233 = ((((((((((22u + var_226) + var_231) + var_212) + var_213) + var_232) + var_215) + var_216) + var_217) + var_233) + var_218) + var_237;
            (mem)[(((global_invocation_id.x + 165u) % total_ids) * 9u) + 7u] = (var_238 + var_221) + var_239;
        }
    }
}
	var_1 = ((((((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + mem[(global_invocation_id.x * 9u) + 3u]) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236) + var_240) + var_241) + var_242) + var_244) + var_246) + var_250;
	if (14u < var_251) {
    if (12u > var_252) {
        if (var_243 > mem[(((global_invocation_id.x + 343u) % total_ids) * 9u) + 5u]) {
            var_66 = ((((((((((24u + mem[0u]) + var_253) + var_245) + var_254) + var_247) + var_248) + var_255) + var_249) + var_258) + var_256) + var_257;
            (mem)[(((global_invocation_id.x + 157u) % total_ids) * 9u) + 6u] = (((((mem[(global_invocation_id.x * 9u) + 4u] + var_262) + 20u) + var_259) + var_260) + var_263) + var_261;
            var_8 = (((((((((((mem[0u] + var_265) + var_264) + var_267) + var_268) + var_270) + var_266) + var_269) + var_0) + var_2) + var_271) + var_4) + var_5;
            var_7 = (((((((mem[(global_invocation_id.x * 9u) + 3u] + var_7) + var_272) + var_1) + var_3) + var_8) + var_10) + var_6) + var_12;
            var_116 = (((((((((((var_9 + var_11) + var_13) + var_14) + var_15) + var_18) + var_19) + var_16) + var_17) + var_25) + var_29) + var_30) + var_20;
            var_137 = (4u + mem[(global_invocation_id.x * 9u) + 8u]) + var_36;
            var_53 = (((24u + mem[(global_invocation_id.x * 9u) + 7u]) + var_21) + var_22) + var_37;
            var_14 = (((((((((((12u + 2u) + var_23) + var_24) + var_38) + var_26) + var_45) + var_47) + var_49) + var_27) + var_28) + var_50) + var_31;
            var_231 = (((((((((((var_32 + var_51) + var_33) + var_53) + var_34) + var_35) + var_55) + var_56) + var_39) + var_57) + var_40) + var_65) + var_66;
            var_120 = ((((((((((((((2u + 2u) + var_72) + var_41) + var_75) + var_77) + var_42) + var_43) + var_44) + var_46) + var_48) + var_52) + var_79) + var_54) + var_58) + var_81;
            var_153 = (((((((((((((((mem[(global_invocation_id.x * 9u) + 9u] + var_59) + var_82) + var_60) + var_84) + var_61) + var_62) + var_85) + var_86) + var_89) + var_63) + var_64) + var_90) + var_92) + var_93) + var_94) + var_95;
            var_111 = (((((((((((((((var_97 + 14u) + var_67) + var_68) + var_98) + var_69) + var_102) + var_70) + var_71) + var_103) + var_109) + var_73) + var_74) + var_110) + var_76) + var_111) + var_112;
            (mem)[(global_invocation_id.x * 9u) + 4u] = ((((((((((var_114 + mem[(global_invocation_id.x * 9u) + 3u]) + var_116) + var_78) + var_80) + var_83) + var_117) + var_120) + var_87) + var_122) + var_125) + var_126;
            var_219 = ((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + 22u) + var_88) + var_91) + var_129) + var_96) + var_99) + var_100) + var_133) + var_135) + var_137) + var_101) + var_138) + var_104;
            var_17 = ((((((var_105 + mem[(global_invocation_id.x * 9u) + 2u]) + var_141) + var_106) + var_107) + var_108) + var_113) + var_115;
            var_211 = ((((((((mem[(global_invocation_id.x * 9u) + 5u] + var_118) + var_143) + var_147) + var_148) + var_149) + var_153) + var_119) + var_156) + var_121;
            var_7 = (((((((((((((mem[(((global_invocation_id.x + 360u) % total_ids) * 9u) + 6u] + var_123) + var_157) + var_158) + var_162) + var_124) + var_166) + var_127) + var_128) + var_167) + var_130) + var_168) + var_131) + var_132) + var_134;
            var_239 = (((((((mem[0u] + var_136) + var_139) + var_169) + var_172) + var_174) + var_140) + var_187) + var_142;
            var_2 = (((((8u + var_191) + var_196) + var_144) + var_145) + var_201) + var_146;
            var_243 = (var_150 + 20u) + 24u;
            var_256 = ((((((6u + 4u) + var_202) + var_151) + var_203) + var_206) + var_152) + var_207;
            (mem)[(global_invocation_id.x * 9u) + 5u] = ((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + mem[0u]) + var_154) + var_208) + var_155) + var_209) + var_210) + var_159) + var_211) + var_160) + var_161) + var_163) + var_214) + var_164;
            (mem)[(global_invocation_id.x * 9u) + 2u] = (((((((((((((((((var_165 + var_170) + var_171) + var_173) + var_219) + var_220) + var_222) + var_175) + var_176) + var_177) + var_178) + var_179) + var_226) + var_231) + var_180) + var_232) + var_233) + var_237) + var_181;
            var_77 = (((((((var_238 + var_239) + 0u) + var_182) + var_243) + var_183) + var_184) + var_245) + var_185;
            var_65 = (((((((((((((((var_186 + var_188) + var_189) + var_247) + var_190) + var_192) + var_193) + var_248) + var_249) + var_256) + var_194) + var_195) + var_197) + var_198) + var_257) + var_199) + var_259;
            var_98 = (((((((14u + 14u) + var_200) + var_260) + var_204) + var_205) + var_261) + var_212) + var_264;
            var_191 = (((((((((((((mem[(((global_invocation_id.x + 409u) % total_ids) * 9u) + 1u] + var_213) + var_215) + var_216) + var_266) + var_217) + var_218) + var_269) + var_221) + var_223) + var_224) + var_225) + var_227) + var_0) + var_2;
            var_202 = (((((mem[(((global_invocation_id.x + 862u) % total_ids) * 9u) + 6u] + 8u) + var_4) + var_5) + var_228) + var_7) + var_229;
            var_114 = var_8 + 18u;
            var_260 = var_230 + 20u;
            var_243 = var_234 + var_10;
            (mem)[(((global_invocation_id.x + 533u) % total_ids) * 9u) + 9u] = ((((var_12 + var_235) + var_236) + var_240) + var_241) + var_242;
            (mem)[(((global_invocation_id.x + 545u) % total_ids) * 9u) + 5u] = (((((((((((((mem[(global_invocation_id.x * 9u) + 5u] + var_14) + var_244) + var_16) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_17) + var_255) + var_258) + var_25) + var_262;
            var_53 = ((((((((6u + 4u) + var_29) + var_263) + var_265) + var_30) + var_267) + var_268) + var_36) + var_270;
            var_249 = (((((((((((((22u + var_271) + var_37) + var_38) + var_45) + var_47) + var_272) + var_1) + var_3) + var_6) + var_9) + var_49) + var_50) + var_51) + var_53;
            (mem)[(global_invocation_id.x * 9u) + 2u] = ((((((18u + var_11) + var_13) + var_55) + var_15) + var_18) + var_19) + var_56;
            (mem)[(global_invocation_id.x * 9u) + 6u] = ((((((((var_20 + var_21) + var_22) + var_23) + var_57) + var_24) + var_65) + var_66) + var_26) + var_27;
            var_49 = ((((((((((((((((var_28 + 6u) + var_31) + var_32) + var_72) + var_75) + var_33) + var_77) + var_34) + var_35) + var_39) + var_79) + var_40) + var_81) + var_82) + var_84) + var_41) + var_42;
            var_16 = ((((((((((mem[(((global_invocation_id.x + 17u) % total_ids) * 9u) + 4u] + mem[(global_invocation_id.x * 9u) + 3u]) + var_85) + var_86) + var_43) + var_89) + var_90) + var_44) + var_92) + var_46) + var_93) + var_94;
            (mem)[(global_invocation_id.x * 9u) + 2u] = ((((((((((((22u + mem[(global_invocation_id.x * 9u) + 2u]) + var_48) + var_52) + var_54) + var_95) + var_97) + var_58) + var_59) + var_98) + var_60) + var_102) + var_61) + var_103;
            (mem)[(((global_invocation_id.x + 151u) % total_ids) * 9u) + 7u] = (((((((((var_109 + var_110) + var_111) + var_112) + var_62) + var_63) + var_114) + var_116) + var_117) + var_120) + var_122;
        }
    } else {
        var_29 = ((((((((12u + var_64) + var_67) + var_125) + var_126) + var_129) + var_68) + var_69) + var_133) + var_135;
        var_191 = (((4u + mem[(global_invocation_id.x * 9u) + 1u]) + mem[(((global_invocation_id.x + 897u) % total_ids) * 9u) + 2u]) + var_137) + var_70;
        var_111 = (((((4u + mem[(global_invocation_id.x * 9u) + 9u]) + var_138) + var_71) + var_73) + var_74) + var_76;
        (mem)[(((global_invocation_id.x + 574u) % total_ids) * 9u) + 5u] = ((((((18u + mem[(((global_invocation_id.x + 532u) % total_ids) * 9u) + 6u]) + var_78) + var_80) + var_141) + var_143) + var_147) + var_148;
        if (22u < var_83) {
            (mem)[(global_invocation_id.x * 9u) + 6u] = ((((((((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + var_149) + var_87) + var_153) + var_88) + var_91) + var_156) + var_96) + var_157) + var_158) + var_99) + var_100) + var_101) + var_162) + var_104) + var_166) + var_105) + var_106) + var_167) + var_107;
            var_10 = (((((((((((((var_168 + mem[(global_invocation_id.x * 9u) + 1u]) + var_169) + var_172) + var_174) + var_108) + var_187) + var_113) + var_191) + var_115) + var_118) + var_196) + var_201) + var_202) + var_119;
            var_161 = ((((((((mem[(global_invocation_id.x * 9u) + 8u] + var_121) + var_123) + var_124) + var_127) + var_128) + var_130) + var_131) + var_132) + var_134;
            (mem)[(global_invocation_id.x * 9u) + 5u] = ((((((((((((((var_203 + var_206) + var_136) + var_139) + var_140) + var_207) + var_208) + var_142) + var_209) + var_144) + var_210) + var_145) + var_146) + var_150) + var_211) + var_151;
            (mem)[(global_invocation_id.x * 9u) + 9u] = (((((((((((((((var_214 + var_219) + var_152) + var_154) + var_155) + var_220) + var_159) + var_222) + var_226) + var_231) + var_160) + var_232) + var_161) + var_233) + var_237) + var_163) + var_238;
            (mem)[(((global_invocation_id.x + 24u) % total_ids) * 9u) + 1u] = ((((((((((((((((20u + var_164) + var_239) + var_165) + var_170) + var_243) + var_245) + var_171) + var_247) + var_173) + var_248) + var_249) + var_175) + var_256) + var_176) + var_257) + var_259) + var_177;
            var_239 = (((var_178 + 0u) + var_260) + var_261) + var_264;
            var_14 = ((((((4u + mem[(global_invocation_id.x * 9u) + 5u]) + var_179) + var_266) + var_180) + var_269) + var_0) + var_2;
            var_231 = (((((((((((((((((mem[(global_invocation_id.x * 9u) + 9u] + mem[0u]) + var_181) + var_4) + var_182) + var_5) + var_7) + var_183) + var_8) + var_10) + var_184) + var_12) + var_14) + var_185) + var_186) + var_188) + var_189) + var_16) + var_17;
            var_81 = (((((((((((((((mem[(global_invocation_id.x * 9u) + 8u] + var_25) + var_29) + var_190) + var_30) + var_36) + var_192) + var_193) + var_37) + var_194) + var_195) + var_197) + var_38) + var_45) + var_47) + var_198) + var_199;
            (mem)[(((global_invocation_id.x + 452u) % total_ids) * 9u) + 5u] = (((((((((((((((((((8u + 2u) + var_200) + var_204) + var_49) + var_50) + var_205) + var_51) + var_212) + var_213) + var_53) + var_215) + var_216) + var_217) + var_55) + var_218) + var_56) + var_57) + var_65) + var_66) + var_221;
            (mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((mem[(global_invocation_id.x * 9u) + 3u] + mem[(global_invocation_id.x * 9u) + 3u]) + mem[0u]) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236;
            var_34 = ((((((((((((((((18u + mem[(global_invocation_id.x * 9u) + 3u]) + var_240) + var_241) + var_242) + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258) + var_262) + var_263) + var_265) + var_267;
        }
    }
} else {
    for (var i_2: u32 = min(mem[(((global_invocation_id.x + 335u) % total_ids) * 9u) + 9u], 10u); i_2 > 0u; i_2 = i_2 - 1u) {
        var_98 = (((((((var_72 + var_75) + var_268) + var_270) + var_77) + var_79) + var_81) + var_82) + var_84;
        var_214 = ((((2u + var_85) + mem[(((global_invocation_id.x + 784u) % total_ids) * 9u) + 5u]) + var_271) + var_272) + var_86;
        var_232 = ((((((((mem[(global_invocation_id.x * 9u) + 8u] + mem[0u]) + var_89) + var_90) + var_92) + var_93) + var_94) + var_1) + var_95) + var_3;
    }
    var_10 = ((((((((((var_6 + var_9) + var_11) + var_97) + var_13) + var_98) + var_102) + var_103) + var_109) + var_110) + var_15) + var_18;
    for (var i_2: u32 = min(14u, 10u); i_2 > 0u; i_2 = i_2 - 1u) {
        var_107 = (((((((((var_19 + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31) + var_32;
        var_220 = ((((((((((((((((((var_111 + 4u) + var_33) + var_34) + var_35) + var_112) + var_39) + var_40) + var_41) + var_42) + var_43) + var_44) + var_46) + var_114) + var_116) + var_117) + var_48) + var_52) + var_54) + var_120;
        if (2u > mem[0u]) {
            (mem)[(global_invocation_id.x * 9u) + 5u] = (((((((((((((((((mem[0u] + mem[(global_invocation_id.x * 9u) + 8u]) + var_58) + var_122) + var_59) + var_60) + var_61) + var_125) + var_62) + var_63) + var_126) + var_64) + var_129) + var_133) + var_67) + var_68) + var_135) + var_69) + var_70;
            (mem)[(((global_invocation_id.x + 836u) % total_ids) * 9u) + 7u] = (((((((((((((((mem[0u] + 12u) + var_71) + var_137) + var_73) + var_74) + var_138) + var_76) + var_78) + var_80) + var_141) + var_143) + var_83) + var_87) + var_147) + var_148) + var_149;
            var_226 = ((((mem[(((global_invocation_id.x + 565u) % total_ids) * 9u) + 5u] + var_153) + var_156) + var_88) + var_157) + var_158;
            var_246 = (12u + var_91) + var_96;
            (mem)[(global_invocation_id.x * 9u) + 9u] = (var_162 + mem[(global_invocation_id.x * 9u) + 1u]) + var_166;
            var_98 = (((((((((((((((((((8u + mem[(global_invocation_id.x * 9u) + 8u]) + 2u) + var_167) + var_168) + var_169) + var_172) + var_99) + var_174) + var_187) + var_191) + var_100) + var_196) + var_101) + var_201) + var_104) + var_105) + var_202) + var_203) + var_206) + var_207;
            var_47 = (((((((((((((((((10u + mem[(global_invocation_id.x * 9u) + 3u]) + var_106) + var_208) + var_209) + var_210) + var_211) + var_214) + var_219) + var_220) + var_107) + var_222) + var_226) + var_108) + var_231) + var_232) + var_113) + var_115) + var_233;
            (mem)[(((global_invocation_id.x + 101u) % total_ids) * 9u) + 7u] = ((((((((((((22u + 14u) + var_237) + var_118) + var_119) + var_238) + var_239) + var_121) + var_123) + var_243) + var_124) + var_245) + var_247) + var_127;
            var_110 = ((((((var_248 + var_249) + var_256) + var_128) + var_130) + var_131) + var_132) + var_134;
            var_2 = (var_257 + 20u) + var_259;
            var_183 = ((((((((((((((((0u + 20u) + var_136) + var_139) + var_140) + var_142) + var_144) + var_145) + var_146) + var_150) + var_151) + var_152) + var_154) + var_155) + var_159) + var_160) + var_161) + var_163;
            var_75 = (8u + mem[(((global_invocation_id.x + 839u) % total_ids) * 9u) + 4u]) + var_164;
            var_104 = (((2u + 0u) + var_165) + var_170) + var_171;
            var_95 = (((mem[(global_invocation_id.x * 9u) + 4u] + var_260) + var_261) + var_264) + var_173;
            var_216 = ((((((((var_175 + mem[(global_invocation_id.x * 9u) + 3u]) + var_176) + var_177) + var_178) + var_179) + var_180) + var_181) + var_182) + var_183;
            var_233 = (((((((var_266 + 24u) + var_269) + var_184) + var_185) + var_0) + var_2) + var_4) + var_5;
            var_232 = ((((((((((((((var_186 + mem[(global_invocation_id.x * 9u) + 8u]) + var_188) + var_189) + var_7) + var_190) + var_192) + var_193) + var_8) + var_194) + var_10) + var_12) + var_14) + var_195) + var_16) + var_17;
            var_201 = (((((((((((((((mem[(((global_invocation_id.x + 760u) % total_ids) * 9u) + 4u] + var_197) + var_198) + var_25) + var_29) + var_30) + var_199) + var_36) + var_200) + var_37) + var_38) + var_204) + var_45) + var_47) + var_49) + var_205) + var_212;
            var_3 = ((((mem[0u] + var_213) + var_215) + var_216) + var_217) + var_218;
            var_4 = ((var_50 + var_51) + var_221) + var_53;
            (mem)[(((global_invocation_id.x + 360u) % total_ids) * 9u) + 2u] = ((((((var_223 + var_55) + var_56) + var_57) + var_65) + var_66) + var_224) + var_225;
            (mem)[(global_invocation_id.x * 9u) + 7u] = (((((((((((((((mem[0u] + 2u) + var_72) + var_75) + var_227) + var_228) + var_229) + var_77) + var_79) + var_230) + var_81) + var_82) + var_234) + var_84) + var_85) + var_86) + var_235;
            var_67 = ((((((((((((mem[0u] + mem[(global_invocation_id.x * 9u) + 3u]) + var_236) + var_240) + var_241) + var_242) + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255;
            (mem)[(global_invocation_id.x * 9u) + 3u] = ((((((((((var_258 + var_262) + var_263) + var_265) + var_267) + var_268) + var_270) + var_271) + var_272) + var_1) + var_3) + var_6;
            var_199 = (((((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + mem[0u]) + var_9) + var_11) + var_13) + var_15) + var_18) + var_19) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31;
        }
    }
}
	(mem)[(((global_invocation_id.x + 1013u) % total_ids) * 9u) + 6u] = var_32 + var_33;
	var_103 = mem[0u] + var_89;
	var_69 = ((((var_34 + var_35) + var_39) + var_40) + var_41) + var_42;
	(mem)[(((global_invocation_id.x + 181u) % total_ids) * 9u) + 2u] = (((0u + var_43) + var_90) + var_92) + var_44;
	var_252 = (((((((6u + var_46) + var_48) + var_52) + var_54) + var_58) + var_59) + var_60) + var_61;
	(mem)[(global_invocation_id.x * 9u) + 9u] = (((((((((((((((((mem[(global_invocation_id.x * 9u) + 3u] + var_62) + var_63) + var_64) + var_93) + var_67) + var_94) + var_95) + var_68) + var_97) + var_98) + var_102) + var_103) + var_69) + var_70) + var_71) + var_73) + var_74) + var_76;
	
	
	
	
	
	
	
	
	for (var i_2: u32 = min(var_105, 10u); i_2 > 0u; i_2 = i_2 - 1u) {
    var_272 = ((((((((((((((var_106 + var_107) + var_108) + var_113) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127) + var_128) + var_130) + var_131) + var_132) + var_134;
    for (var i_3: u32 = min(var_196, 10u); i_3 > 0u; i_3 = i_3 - 1u) {
        var_147 = ((var_201 + 4u) + var_136) + var_202;
        var_25 = ((((var_203 + mem[0u]) + 4u) + var_206) + var_139) + var_207;
        (mem)[(global_invocation_id.x * 9u) + 9u] = var_140 + var_208;
        var_12 = ((((((((((mem[0u] + var_142) + var_144) + var_145) + var_209) + var_210) + var_146) + var_150) + var_151) + var_152) + var_154) + var_155;
        (mem)[(global_invocation_id.x * 9u) + 4u] = (var_211 + var_214) + var_219;
        var_36 = ((((((((var_220 + mem[(global_invocation_id.x * 9u) + 1u]) + var_159) + var_160) + var_161) + var_163) + var_164) + var_165) + var_170) + var_171;
        var_79 = ((((((22u + mem[(global_invocation_id.x * 9u) + 5u]) + var_222) + var_173) + var_175) + var_226) + var_231) + var_232;
        var_85 = ((((((((((((var_176 + mem[(global_invocation_id.x * 9u) + 9u]) + var_233) + var_177) + var_237) + var_238) + var_239) + var_178) + var_179) + var_243) + var_245) + var_180) + var_181) + var_247;
        var_56 = (((((((((var_182 + var_248) + var_249) + var_256) + var_257) + var_183) + var_184) + var_185) + var_259) + var_260) + var_261;
        var_138 = ((((0u + 12u) + var_264) + var_266) + var_186) + var_269;
        (mem)[(((global_invocation_id.x + 61u) % total_ids) * 9u) + 7u] = (((((((((var_0 + var_188) + mem[(((global_invocation_id.x + 625u) % total_ids) * 9u) + 9u]) + var_189) + var_2) + var_4) + var_190) + var_5) + var_7) + var_8) + var_192;
        var_209 = (var_193 + mem[(((global_invocation_id.x + 297u) % total_ids) * 9u) + 6u]) + var_194;
        var_8 = (var_10 + 0u) + 20u;
        (mem)[(global_invocation_id.x * 9u) + 4u] = (((((((((mem[(global_invocation_id.x * 9u) + 2u] + var_12) + var_14) + var_195) + var_197) + var_16) + var_198) + var_199) + var_200) + var_204) + var_17;
        (mem)[(((global_invocation_id.x + 431u) % total_ids) * 9u) + 4u] = (((mem[(global_invocation_id.x * 9u) + 4u] + var_25) + var_29) + var_205) + var_212;
        var_210 = ((((mem[(global_invocation_id.x * 9u) + 3u] + var_213) + var_215) + var_30) + var_36) + var_37;
        var_157 = ((((var_216 + var_217) + var_38) + var_218) + var_221) + var_45;
        (mem)[(((global_invocation_id.x + 378u) % total_ids) * 9u) + 1u] = (((((((((((((((((mem[0u] + var_47) + var_49) + var_223) + var_224) + var_225) + var_50) + var_51) + var_53) + var_55) + var_227) + var_56) + var_228) + var_57) + var_229) + var_230) + var_65) + var_234) + var_66;
        var_266 = (((14u + mem[(((global_invocation_id.x + 573u) % total_ids) * 9u) + 2u]) + var_235) + var_72) + var_236;
        (mem)[(((global_invocation_id.x + 489u) % total_ids) * 9u) + 6u] = ((((((((((((((((mem[(global_invocation_id.x * 9u) + 8u] + 12u) + var_75) + var_240) + var_77) + var_241) + var_79) + var_242) + var_81) + var_82) + var_244) + var_246) + var_250) + var_251) + var_252) + var_84) + var_253) + var_85;
        var_141 = var_86 + 22u;
        var_2 = (((((((((((18u + mem[(((global_invocation_id.x + 448u) % total_ids) * 9u) + 2u]) + var_89) + var_254) + var_90) + var_92) + var_255) + var_93) + var_258) + var_262) + var_94) + var_95) + var_263;
        var_122 = ((((((((((((var_265 + mem[(global_invocation_id.x * 9u) + 4u]) + var_267) + var_97) + var_268) + var_270) + var_271) + var_272) + var_1) + var_3) + var_98) + var_102) + var_103) + var_6;
    }
    var_45 = (((var_109 + var_110) + var_111) + var_112) + var_9;
    (mem)[(((global_invocation_id.x + 491u) % total_ids) * 9u) + 9u] = ((((((((((((((8u + 16u) + var_114) + var_116) + var_117) + var_11) + var_13) + var_15) + var_18) + var_120) + var_19) + var_122) + var_20) + var_21) + var_22) + var_125;
    (mem)[(global_invocation_id.x * 9u) + 7u] = (((((((var_126 + var_129) + var_133) + var_135) + var_23) + var_137) + var_138) + var_141) + var_24;
    (mem)[(global_invocation_id.x * 9u) + 2u] = ((mem[(global_invocation_id.x * 9u) + 8u] + var_143) + var_147) + var_26;
    (mem)[(global_invocation_id.x * 9u) + 4u] = (((((((((((var_148 + mem[(global_invocation_id.x * 9u) + 9u]) + var_149) + var_27) + var_28) + var_153) + var_156) + var_31) + var_157) + var_32) + var_33) + var_34) + var_158;
    for (var i_3: u32 = min(mem[(global_invocation_id.x * 9u) + 8u], 10u); i_3 > 0u; i_3 = i_3 - 1u) {
        var_259 = ((((var_162 + mem[0u]) + var_166) + var_167) + var_35) + var_39;
        var_29 = (((((mem[(global_invocation_id.x * 9u) + 1u] + var_168) + var_40) + var_41) + var_42) + var_43) + var_169;
        (mem)[(global_invocation_id.x * 9u) + 1u] = (var_44 + var_46) + var_48;
        var_234 = (((mem[(global_invocation_id.x * 9u) + 3u] + var_52) + var_54) + var_58) + var_59;
        var_172 = (var_172 + var_174) + var_187;
        var_266 = (((((((((((((var_60 + mem[(global_invocation_id.x * 9u) + 8u]) + var_61) + var_191) + var_62) + var_63) + var_64) + var_196) + var_67) + var_68) + var_69) + var_201) + var_202) + var_203) + var_70;
        (mem)[(global_invocation_id.x * 9u) + 8u] = (((((((((((((((((mem[(global_invocation_id.x * 9u) + 8u] + 8u) + var_71) + var_73) + var_74) + var_76) + var_78) + var_80) + var_83) + var_87) + var_88) + var_91) + var_96) + var_99) + var_100) + var_101) + var_104) + var_105) + var_106;
        (mem)[(global_invocation_id.x * 9u) + 3u] = (((((((((((((((var_107 + var_108) + var_113) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127) + var_128) + var_130) + var_131) + var_132) + var_134) + var_136) + var_139;
        (mem)[(global_invocation_id.x * 9u) + 8u] = (14u + 12u) + var_140;
        var_43 = (((((22u + mem[0u]) + var_142) + var_144) + var_145) + var_146) + var_150;
        var_111 = ((((((((mem[(global_invocation_id.x * 9u) + 2u] + mem[(((global_invocation_id.x + 323u) % total_ids) * 9u) + 6u]) + var_151) + var_152) + var_206) + var_207) + var_154) + var_208) + var_155) + var_209;
        var_35 = ((((((((mem[0u] + 14u) + var_159) + var_160) + var_161) + var_163) + var_164) + var_165) + var_170) + var_171;
        var_117 = (((((((20u + var_173) + var_210) + var_175) + var_211) + var_214) + var_219) + var_176) + var_177;
        var_154 = ((((((mem[(global_invocation_id.x * 9u) + 3u] + 16u) + var_178) + var_179) + var_180) + var_181) + var_182) + var_183;
        var_133 = ((((((var_184 + mem[(global_invocation_id.x * 9u) + 1u]) + var_220) + var_185) + var_222) + var_186) + var_226) + var_231;
        var_81 = ((((((((((((((var_232 + var_233) + var_188) + var_237) + var_238) + var_189) + var_190) + var_239) + var_192) + var_193) + var_194) + var_243) + var_245) + var_195) + var_197) + var_198;
        (mem)[(((global_invocation_id.x + 798u) % total_ids) * 9u) + 2u] = (((((mem[(global_invocation_id.x * 9u) + 3u] + mem[0u]) + var_199) + var_200) + var_247) + var_204) + var_205;
        var_244 = (((((((((((((((((((mem[0u] + 24u) + var_212) + var_213) + var_215) + var_216) + var_217) + var_218) + var_221) + var_223) + var_224) + var_225) + var_227) + var_228) + var_229) + var_230) + var_234) + var_235) + var_236) + var_240) + var_241;
        var_205 = (((((((((((var_242 + var_244) + var_246) + var_250) + var_251) + var_252) + var_253) + var_254) + var_255) + var_258) + var_262) + var_263) + var_265;
        var_210 = (((((((((var_248 + 12u) + var_249) + var_267) + var_256) + var_257) + var_268) + var_270) + var_259) + var_260) + var_271;
        var_194 = ((((((((((((((((((mem[0u] + var_272) + var_1) + var_3) + var_6) + var_9) + var_11) + var_13) + var_15) + var_18) + var_19) + var_20) + var_21) + var_22) + var_23) + var_24) + var_26) + var_27) + var_28) + var_31;
        var_140 = 4u + var_32;
        (mem)[(global_invocation_id.x * 9u) + 8u] = ((((((((((((22u + var_33) + var_34) + var_35) + var_39) + var_40) + var_41) + var_42) + var_43) + var_44) + var_46) + var_48) + var_52) + var_54;
        var_120 = ((((((((((((((((((((10u + 24u) + mem[(((global_invocation_id.x + 982u) % total_ids) * 9u) + 2u]) + var_58) + var_261) + var_264) + var_59) + var_60) + var_266) + var_269) + var_61) + var_0) + var_2) + var_62) + var_63) + var_4) + var_64) + var_67) + var_68) + var_5) + var_7) + var_8;
        (mem)[(global_invocation_id.x * 9u) + 6u] = (((((mem[(global_invocation_id.x * 9u) + 3u] + 6u) + 16u) + var_10) + var_12) + var_14) + var_69;
        (mem)[(((global_invocation_id.x + 78u) % total_ids) * 9u) + 5u] = (((((((((((((((((mem[(global_invocation_id.x * 9u) + 9u] + 22u) + var_16) + var_70) + var_71) + var_73) + var_17) + var_25) + var_29) + var_30) + var_36) + var_74) + var_76) + var_78) + var_80) + var_37) + var_83) + var_38) + var_87;
        (mem)[(((global_invocation_id.x + 837u) % total_ids) * 9u) + 5u] = (((((((((var_88 + var_91) + var_96) + var_45) + var_99) + var_47) + var_100) + var_101) + var_104) + var_105) + var_106;
        var_0 = (((((mem[(global_invocation_id.x * 9u) + 9u] + mem[(global_invocation_id.x * 9u) + 5u]) + var_49) + var_107) + var_108) + var_50) + var_51;
        var_89 = ((((mem[(((global_invocation_id.x + 979u) % total_ids) * 9u) + 5u] + var_53) + var_113) + var_55) + var_56) + var_57;
        var_258 = (((((((22u + mem[0u]) + var_115) + var_118) + var_119) + var_121) + var_123) + var_124) + var_127;
        var_212 = ((22u + var_128) + var_130) + var_131;
        var_138 = (((((((var_65 + var_132) + var_66) + var_134) + var_72) + var_75) + var_77) + var_79) + var_136;
        (mem)[(((global_invocation_id.x + 62u) % total_ids) * 9u) + 4u] = ((((((((var_81 + var_139) + var_140) + var_142) + var_144) + var_82) + var_84) + var_85) + var_145) + var_146;
    }
}
	(mem)[(global_invocation_id.x * 9u) + 3u] = (((mem[0u] + mem[(global_invocation_id.x * 9u) + 8u]) + var_150) + var_151) + var_152;
	(mem)[(global_invocation_id.x * 9u) + 9u] = (((((((((((mem[(((global_invocation_id.x + 628u) % total_ids) * 9u) + 5u] + var_154) + var_86) + var_89) + var_90) + var_155) + var_159) + var_92) + var_160) + var_93) + var_94) + var_161) + var_163;
	
	
	
	
	
	
	
if (global_invocation_id.x == 0) {
    debug[0] = 42;
}
	var var_dummy: u32 = mem[(global_invocation_id.x * 9u) + 3u];
	var dummy_index_var: i32 = index_buf[0u];
	var dummy_data_var: u32 = data_buf[0u];
	var dummy_output_var: u32 = output_buf[0u].data;
}
